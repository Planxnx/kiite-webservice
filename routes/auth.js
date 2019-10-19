const express = require('express');
const router = express.Router();

const JWTAuthMiddleware = require('../middleware/jwtAuth')


const userService = require('./../model/user/service')

router.get('/health', (req, res, next) => {
  res.json({
    status: 200,
    message: "Auth API Health Good"
  });
});

router.post('/login', (req, res, next) => {
  userService.authenticate({
    username: req.body.username,
    password: req.body.password
  }).then(data => {
    if (data === false) {
      res.json({
        status: 401,
        message: "wrong username or password",
      });
    } else {
      res.json({
        status: 200,
        message: "login success",
        data: {
          token: data.token,
          username: data.username,
          role: data.role
        }
      });
    }

  }).catch(err => {    
    return res.status(401).json({
      status: 401,
      message: err
    });
  })


});

router.post('/register', (req, res, next) => {

  userService.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: req.body.role
  }).then(() => {
    res.json({
      status: 200,
      message: "register success"
    });
  }).catch(err => {
    return res.status(401).json({
      status: 401,
      message: err
    });
  })


});

router.get('/test',JWTAuthMiddleware.userAuth, (req, res, next) => {
  res.json({
    status: 200,
    message: "Auth Success"
  });
});

router.get('/user', JWTAuthMiddleware.adminAuth, (req, res, next) => {
  userService.getAll().then((data)=>{
    res.json({
      status: 200,
      message: "Auth Success",
      data: data
    });
  })
});

module.exports = router;