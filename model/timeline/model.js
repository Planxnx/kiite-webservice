const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    text: {
        type: String,
        required: true
    },
    mood:{
        type: String
    },
    createdBy: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Timeline', schema);