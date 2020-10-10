const router = require('express').Router();
const sessionModel = require('../models/Session');
const userModel = require('../models/User');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../middlewares');

router.post('/', async (req, res, next) => {
    
    // Validate username and password
    try {

        // Get user by username from databases
        const user = await userModel.findOne({ username: req.body.username });

        // Checks if username and password are inserted
        if (req.body.username === '' || req.body.password === '') {
            return res.status(400).json({ error: "Missing username or password" });
        }
        // Checks if provides password is correct
        const passwordCheck = await bcrypt.compare(req.body.password, user.password);
        if (!user || !passwordCheck) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Create session to database
        const session = await sessionModel.create({
            userId: user.id
        })

        // Return token to user
        return res.status(200).json({ token: session._id })
    }
    catch (error) {
        res.status(401).send({ error: "Invalid username or password" })
    }

})

router.delete('/', verifyToken, async (req, res, next) => {

    try {// Get session by userId from database
        const session = await sessionModel.findOne({userId: req.userId});

        // Check that session existed in the database
        if(!session){
            return res.status(404).json({error: "Invalid session"});
        }

        // Delete session from the database
        await sessionModel.deleteOne({_id: session._id.toString()});

        // Return token to user
        return res.status(204).json();
    }
    catch(e){
        return res.status(400).json({error: e.message});
    }

})

module.exports = router;