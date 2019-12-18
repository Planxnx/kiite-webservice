const socketio = require('socket.io')
const userService = require('./model/user/service')
const http = require('http');
const { URL } = require('url');

let helperQueue = []
let userQueue = []
let chatRoom = []

const userType = [
    'tiger',
    'pig',
    'cat',
    'penguin',
    'dog'
]

const findStat = async (username, matchername, topic) => {
    let userData = await userService.getByUsername(username)
    let matcherData = await userService.getByUsername(matchername)
    return {
        userStat: userData["stat"][topic],
        matcherStat: matcherData["stat"][topic]
    }
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const findMatcher = () => {
    //. เอาโค้ดที่ซ้ำกันมาใส่ฟังชั่น .//
}

module.exports.listen = (app, opt) => {
    io = socketio.listen(app, opt)

    io.on('connection', (socket) => {
        console.log(`connected : ${socket.id}`);

        socket.emit('queue_chat', {
            'userQueue': userQueue.length,
            'helperQueue': helperQueue.length
        });

        socket.on('disconnect', () => {
            console.log(`disconnected : ${socket.id}`);
            let helperObj = chatRoom.find(x => x.helperID === socket.id)
            let userObj = chatRoom.find(x => x.userID === socket.id)

            if (userQueue.includes(socket)) {
                let index = userQueue.indexOf(socket)
                userQueue.splice(index, 1)
            } else if (helperQueue.includes(socket)) {
                let index = helperQueue.indexOf(socket)
                helperQueue.splice(index, 1)
            } else if (helperObj) {
                console.log("#Helper disconnected");
                socket.to(helperObj.room).emit('end_chat', "Helper disconnected")
                let index = chatRoom.indexOf(helperObj)
                chatRoom.splice(index, 1)
            } else if (userObj) {
                console.log("#User disconnected");
                socket.to(userObj.room).emit('end_chat', "User disconnected")
                let index = chatRoom.indexOf(userObj)
                chatRoom.splice(index, 1)
            }

            console.log("disconnected : " + socket.id);
            console.log("helper:" + helperQueue.length);
            console.log("user:" + userQueue.length);
            socket.broadcast.emit('queue_chat', {
                'userQueue': userQueue.length,
                'helperQueue': helperQueue.length
            });
        })

        socket.on('find_chat', (data) => {
            switch (data.type) {
                case "user":
                    if (helperQueue.length != 0) {
                        let matcher = helperQueue.find(x => x.topic === data.topic)
                        let index = helperQueue.indexOf(matcher)
                        helperQueue.splice(index, 1)
                        let room = `${data.topic}${socket.id}${matcher.id}`;

                        matcher.join(room);
                        socket.join(room);

                        let userPName = userType[getRandomInt(userType.length)]
                        let helperPName = userType[getRandomInt(userType.length)]
                        while (userPName == helperPName) {
                            helperPName = userType[getRandomInt(userType.length)]
                        }

                        chatRoom.push({
                            helperName: helperPName,
                            helperID: matcher.id,
                            userName: userPName,
                            userSocket: socket.id,
                            room: room
                        })

                        findStat(data.username, matcher.username, data.topic).then(dataStat => {
                            matcher.emit('found_chat', {
                                matchName: userPName,
                                yourName: helperPName,
                                room: room,
                                topic: data.topic,
                                matcherStat: dataStat.userStat
                            });
                            socket.emit('found_chat', {
                                matchName: helperPName,
                                yourName: userPName,
                                room: room,
                                topic: data.topic,
                                matcherStat: dataStat.matcherStat
                            });
                        })

                        io.emit('queue_chat', {
                            'userQueue': userQueue.length,
                            'helperQueue': helperQueue.length
                        });
                        console.log("Match!");
                        console.log("helper:" + helperQueue.length)
                        console.log("user:" + userQueue.length)
                    } else {
                        let socketUser = socket
                        socketUser.topic = data.topic
                        socketUser.username = data.username
                        userQueue.push(socketUser);
                        io.emit('queue_chat', {
                            'userQueue': userQueue.length,
                            'helperQueue': helperQueue.length
                        });
                        console.log("helper:" + helperQueue.length)
                        console.log("user:" + userQueue.length)
                    }
                    break;
                case "helper":
                    if (userQueue.length != 0) {
                        let matcher = userQueue.find(x => x.topic === data.topic)
                        let index = userQueue.indexOf(matcher)
                        userQueue.splice(index, 1)
                        let room = `${data.topic}${socket.id}${matcher.id}`;
                        // let room = socket.id + '#' + matcher.id;

                        matcher.join(room);
                        socket.join(room);
                        let userPName = userType[getRandomInt(userType.length)]
                        let helperPName = userType[getRandomInt(userType.length)]
                        while (userPName == helperPName) {
                            helperPName = userType[getRandomInt(userType.length)]
                        }

                        chatRoom.push({
                            helperName: helperPName,
                            helperID: socket.id,
                            userName: userPName,
                            userID: matcher.id,
                            room: room
                        })

                        findStat(data.username, matcher.username, data.topic).then(dataStat => {
                            matcher.emit('found_chat', {
                                matchName: helperPName,
                                yourName: userPName,
                                room: room,
                                topic: data.topic,
                                matcherStat: dataStat.userStat
                            });
                            socket.emit('found_chat', {
                                matchName: userPName,
                                yourName: helperPName,
                                room: room,
                                topic: data.topic,
                                matcherStat: dataStat.matcherStat
                            });
                        })

                        io.emit('queue_chat', {
                            'userQueue': userQueue.length,
                            'helperQueue': helperQueue.length
                        });
                        console.log("Match!");
                        console.log("helper:" + helperQueue.length)
                        console.log("user:" + userQueue.length)
                    } else {
                        let socketUser = socket
                        socketUser.topic = data.topic
                        socketUser.username = data.username
                        helperQueue.push(socketUser);
                        io.emit('queue_chat', {
                            'userQueue': userQueue.length,
                            'helperQueue': helperQueue.length
                        });
                        console.log("helper:" + helperQueue.length)
                        console.log("user:" + userQueue.length)
                    }
                    break;
                default:
                    console.log("Unknow type");
                    break;
            }
        })

        const getPredicted = (topic,text,callback) => {
            const topicCapitalized = topic.charAt(0).toUpperCase() + topic.slice(1)
            const myURL = new URL(`/${topicCapitalized}?text=${text}`, 'http://13.229.79.95:5000/')
            http.get(myURL, (resp) => {
                resp.setEncoding('utf8');
                let rawData = '';
                resp.on('data', (chunk) => { rawData += chunk; });
                resp.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        callback(text,parsedData.data.mood)
                    } catch (e) {
                        console.error(e.message);
                    }
                })
            })
        }

        socket.on('send_chat',(data) => {
            let predictCount = 1
            let texts = data.text
            var textSplit = texts.split(" ");
            textSplit.forEach((text,index)=>{
                getPredicted(data.topic,text,(txt,mood)=>{
                    if(mood == 'pos'){
                        predictCount += 1
                    } else if (mood == 'neg'){
                        predictCount -= 1
                    }
                    userService.updateMood(data.username,data.topic,mood)
                    if(index+1 == textSplit.length){
                        if (predictCount > 0) data.mood = 'pos'
                        else data.mood = 'neg'
                        console.log("message:" + data.text +" mood:"+data.mood+" room:" + data.room);
                        socket.to(data.room).emit('receive_chat', data); 
                    }
                })
            })
        });
    })

    return io
}