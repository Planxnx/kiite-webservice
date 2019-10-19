const passport = require("passport");
const config = require('../config.json')

const ExtractJwt = require("passport-jwt").ExtractJwt; //ใช้ในการ decode jwt ออกมา
const JwtStrategy = require("passport-jwt").Strategy; //ใช้ในการประกาศ Strategy

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret, 
}

const jwtAuthAdmin = new JwtStrategy(jwtOptions, (payload, done) => {
    if (payload.role === "admin") done(null, true); 
    else done(null, false);
});

const jwtAuthUser = new JwtStrategy(jwtOptions, (payload, done) => {
    if (payload.username === "planxthanee") done(null, true); //ตอนใชี้งานจริงต้องคิวรี่ username จาก database
    else done(null, false);
});

passport.use('admin-rule',jwtAuthAdmin);
passport.use('user-rule',jwtAuthUser);


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