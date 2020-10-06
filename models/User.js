//uus fail
const mongoose = require('mongoose');

module.exports = mongoose.model('User', mongoose.Schema({
    name: { type: String, required: true, min: 2, max: 250 },
    username: { type: String, required: true, min: 2, max: 250, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 250 },
    accounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }]
}, {
    // transform _id to id
    toJSON: {
        transform: (docIn, docOut) => {
            docOut.id = docOut._id;
            delete docOut._id;
            delete docOut.__v;
        }
    }
}))
