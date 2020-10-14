const mongoose = require('mongoose');
const sessionModel = require('./models/Session');
const transactionModel = require('./models/Transaction');
const bankModel = require('./models/Bank');
const fetch = require('node-fetch');

exports.verifyToken = async (req, res, next) => {

    // Check if Authorization header is provided
    let  authorizationHeader = req.header('Authorization');

    if(!authorizationHeader){
        return res.status(401).json({error: "Missing Authorization header"});
    }
    // Split Authorization header into an array by space
    authorizationHeader = authorizationHeader.split(' ');

    // Check Authorization header for token
    if(!authorizationHeader[1]){
        return res.status(400).json({error: "Invalid Authorization header format"});
    }

    // Validate if token is in mongo ObjectId format to prevent UnhandeledPromiseRejectionWarning
    if(!mongoose.Types.ObjectId.isValid(authorizationHeader[1])) {
        return res.status(401).json({error: "Invalid token"})
    }

    const session = await sessionModel.findOne({_id: authorizationHeader[1]});
    if (!session) return res.status(401).json({error: "Invalid token"});

    // Write user's id into reg
    req.userId = session.userId;

    return next();
}

exports.processTransactions = async () => {

    // Get pending transactions
    const pendingTransactions = await transactionModel.find({ status: 'pending'});

    // Contact destination bank
    const banks = await fetch(`${process.env.CENTRAL_BANK_URL}/banks`,{
        headers: {"Api-Key": process.env.CENTRAL_BANK_API_KEY}
    })
        .then(responseText => responseText.text())

    pendingTransactions.forEach(async transaction => {

        const bankTo = await bankModel.findOne({ bankPrefix: transaction.accountTo.slice(0, 3) });

        const r = await fetch(bankTo.transactionUrl, {
            method: 'POST',
            body: JSON.stringify(transaction),
            headers: {
                "Api-Key": process.env.CENTRAL_BANK_API_KEY,
                'Content-Type': 'application/json'
            }
        })
            .then(responseText => responseText.text())

        console.log(r);
        return transaction;
        
    }, Error())

    setTimeout(exports.processTransactions, 1000); 
}