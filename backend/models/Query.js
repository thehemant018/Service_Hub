const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default:new Date(+new Date() + 7*24*60*60*1000)
    }
}, { timestamps: true });

const Query = mongoose.model('Query', querySchema);

module.exports = Query;