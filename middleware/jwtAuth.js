const passport = require("passport");
const config = require('../config.json')

const ExtractJwt = require("passport-jwt").ExtractJwt; //ใช้ในการ decode jwt ออกมา
const JwtStrategy = require("passport-jwt").Strategy; //ใช้ในการประกาศ Strategy

const userService = require('./../model/user/service')

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret,
}

const jwtAuthAdmin = new JwtStrategy(jwtOptions, (payload, done) => {
    userService.getByUsername(payload.username).then((user) => {
        if (user.role != "admin") done(null, false)
        else done(null, true)
    }).catch(err => {
        console.log(`JWT Auth ERROR : ${err}`);
        done(null, true)
    })

});

const jwtAuthUser = new JwtStrategy(jwtOptions, (payload, done) => {
    userService.getByUsername(payload.username).then((user) => {
        if (!user) done(null, false)
        else done(null, true)
    }).catch(err => {
        console.log(`JWT Auth ERROR : ${err}`);
        done(null, true)
    })

});

passport.use('admin-rule', jwtAuthAdmin);
passport.use('user-rule', jwtAuthUser);

const adminAuth = passport.authenticate("admin-rule", {
    session: false
});

const userAuth = passport.authenticate("user-rule", {
    session: false
});

module.exports = {
    adminAuth,
    userAuth
};