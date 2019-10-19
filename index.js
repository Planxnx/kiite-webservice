const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('morgan');
const config = require('./config.json')


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');


const port = process.env.PORT || config.PORT || 8080;

app.use(express.json());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);


app.listen(port, () => {
    console.log(`Application is running on ${port}`)
})