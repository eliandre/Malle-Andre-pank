const mongoose = require('mongoose');
const sessionModel = require('./models/Session');

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