const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../db/index.js');
const User = db.User;
const config = require('../../config.json')

const authenticate = async ({
    username,
    password
}) => {
    const user = await User.findOne({
        username
    });
    if (user && bcrypt.compareSync(password, user.hash)) {
        let role = user.role
        const payload = {
            username: username,
            role: role,
            iat: new Date().getTime() //iatมาจากคำว่า issued at time (สร้างเมื่อ)
        };

        let token = jwt.sign(payload, config.secret)
        console.log(token);
        

        return {
            username,
            role,
            token
        }
    } else throw 'Wrong username or password';
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getByUsername(username) {
    return await User.findOne({
        username
    }).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({
            username: userParam.username
        })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({
            username: userParam.username
        })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}


module.exports = {
    authenticate,
    getAll,
    getByUsername,
    create,
    update
};