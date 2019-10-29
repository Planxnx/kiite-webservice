const express = require('express');
const router = express.Router();

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
    //
    //  ขาดทำ Predict แล้ว save ลง DB
    //    
    timelineService.create({
        text: req.body.text,
        createdBy: req.body.username
    }).then(() => {
        req.app.io.emit('timeline', {
            message: "got a new status"
        })
        res.json({
            status: 200,
            message: "create success"
        })
    }).catch(err => {
        res.status(400).json({
            status: 400,
            message: err
        });
    })
});

module.exports = router;