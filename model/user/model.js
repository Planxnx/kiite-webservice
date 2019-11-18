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
        love: {
            pos: {
                type: Number,
                default: 0
            },
            neg:  {
                type: Number,
                default: 0
            }
        },
        education: {
            pos:  {
                type: Number,
                default: 0
            },
            neg:  {
                type: Number,
                default: 0
            }
        },
        general: {
            pos:  {
                type: Number,
                default: 0
            },
            neg:  {
                type: Number,
                default: 0
            }
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