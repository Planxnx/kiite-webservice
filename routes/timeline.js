const express = require('express');
const router = express.Router();
const http = require('http');
const { URL } = require('url');
const JWTAuthMiddleware = require('../middleware/jwtAuth')

const timelineService = require('./../model/timeline/service')

router.get('/', JWTAuthMiddleware.userAuth, (req, res, next) => {

    //ขาด Overall Sentiment Static

    timelineService.getAll().then((data) => {
        res.json({
            status: 200,
            message: "success",
            data: data
        })
    }).catch(err => {
        res.status(400).json({
            status: 400,
            message: err
        });
    })
});

router.get('/all', JWTAuthMiddleware.adminAuth, (req, res, next) => {
    timelineService.adminGetAll().then((data) => {
        res.json({
            status: 200,
            message: "success",
            data: data
        });
    }).catch(err => {
        res.status(400).json({
            status: 400,
            message: err
        });
    })
});

router.post('/', JWTAuthMiddleware.userAuth, (req, res, next) => {
    let mood = 'none'
    let iconType = ["cat", "dog", "pig", "penguin", "tiger"]
    let randIcon = Math.floor(Math.random() * 5)
    let hexString = (0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
    timelineService.create({
        text: req.body.text,
        mood: undefined,
        createdBy: req.body.username,
        icon: {
            iconType: iconType[randIcon],
            iconColor: `#${hexString}`,
        }
    }).then(() => {
        req.app.io.emit('timeline', {
            message: "got a new status"
        })
        res.json({
            status: 200,
            message: "create success",
            mood: undefined,
        })
    }).catch(err => {
        res.status(400).json({
            status: 400,
            message: err
        });
    })
});

module.exports = router;