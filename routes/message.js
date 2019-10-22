const express = require('express');
const router = express.Router();
const multer = require('multer')

const JWTAuthMiddleware = require('../middleware/jwtAuth')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'voice/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
var upload = multer({
  storage: storage
});

router.post('/voice', JWTAuthMiddleware.userAuth, upload.single('voice'), (req, res, next) => {
  req.app.io.in(req.body.room).emit('voice_chat', {
    message: "got a new voice",
    filename: req.file.filename,
    sender: req.body.sender,
    receiver: req.body.receiver
  })
  res.json({
    status: 200,
    message: "success",
    data: {
      filename: req.file.filename,
      sender: req.body.sender,
      receiver: req.body.receiver
    }
  })
});

router.get('/voice/:voicename', upload.single('voice'), (req, res, next) => {
  res.download(`voice/${req.params.voicename}`);
});


module.exports = router;