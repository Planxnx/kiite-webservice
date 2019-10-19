const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    stat: {
        loveStat: {
            pos: Number,
            neg: Number
        },
        eduStat: {
            pos: Number,
            neg: Number
        },
        genStat: {
            pos: Number,
            neg: Number
        },
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('User', schema);