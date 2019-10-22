const socketio = require('socket.io')

let helperQueue = []
let userQueue = []
let chatRoom = []

const nameOfHelper = [
    'คุณเสือ',
    'คุณหมี',
    'คุณควาย',
    'คุณนก',
    'คุณเพ้น',
    'คุณหี'
]
const nameOfUser = [
    'น้องสิงโต',
    'น้องช้าง',
    'น้องม้า',
    'น้องเหี้ย',
    'น้องเพ้น',
    'น้องจู๋'
]

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
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
            } else if (userObj){
                console.log("#User disconnected");
                socket.to(userObj.room).emit('end_chat',"User disconnected")
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
                        let matcher = helperQueue.shift(); //ดึง sokcet ออกมาจาก array
                        let room = socket.id + '#' + matcher.id;

                        matcher.join(room);
                        socket.join(room);

                        let userName = nameOfUser[getRandomInt(nameOfUser.length)]
                        let helperName = nameOfHelper[getRandomInt(nameOfHelper.length)]

                        chatRoom.push({
                            helperName: helperName,
                            helperID: matcher.id ,
                            userName: userName,
                            userSocket: socket.id,
                            room: room
                        })

                        matcher.emit('found_chat', {
                            matchName: userName,
                            yourName: helperName,
                            room: room
                        });
                        socket.emit('found_chat', {
                            matchName: helperName,
                            yourName: userName,
                            room: room
                        });
                        io.emit('queue_chat', {
                            'userQueue': userQueue.length,
                            'helperQueue': helperQueue.length
                        });
                        console.log("Match!");
                        console.log("helper:" + helperQueue.length)
                        console.log("user:" + userQueue.length)
                    } else {
                        userQueue.push(socket);
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
                        let matcher = userQueue.shift(); //ดึง sokcet ออกมาจาก array
                        let room = socket.id + '#' + matcher.id;

                        matcher.join(room);
                        socket.join(room);
                        let userName = nameOfUser[getRandomInt(nameOfUser.length)]
                        let helperName = nameOfHelper[getRandomInt(nameOfHelper.length)]

                        chatRoom.push({
                            helperName: helperName,
                            helperID:socket.id ,
                            userName: userName,
                            userID: matcher.id,
                            room: room
                        })

                        matcher.emit('found_chat', {
                            matchName: helperName,
                            yourName: userName,
                            room: room
                        });
                        socket.emit('found_chat', {
                            matchName: userName,
                            yourName: helperName,
                            room: room
                        });
                        io.emit('queue_chat', {
                            'userQueue': userQueue.length,
                            'helperQueue': helperQueue.length
                        });
                        console.log("Match!");
                        console.log("helper:" + helperQueue.length)
                        console.log("user:" + userQueue.length)
                    } else {
                        helperQueue.push(socket);
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

        socket.on('send_chat', (data) => {
            console.log("message:" + data.text + " room:" + data.room);
            socket.to(data.room).emit('receive_chat', data);
        });
    })

    return io
}