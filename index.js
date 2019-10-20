const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('./config.json')
var http = require('http').Server(app);
const io = require('socket.io')(http, {
    origins: '*:*'
});

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const timelineRouter = require('./routes/timeline');


const port = process.env.PORT || config.PORT || 8080;

app.use(express.json());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/timeline', timelineRouter);

app.io = io

io.on('connection', (socket) => {
    console.log("connected : " + socket.id);

    socket.on('disconnect',  () => {
        console.log("disconnected : " + socket.id);
    });
})

http.listen(port, function () {
    console.log(`Application is running on ${port}`)
});