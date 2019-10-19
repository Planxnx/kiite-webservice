const mongoose = require('mongoose');
const config = require('../config.json')

mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../model/user/model.js')
};