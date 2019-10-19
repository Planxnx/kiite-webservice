var express = require('express');
var router = express.Router();

router.get('/health', function(req, res, next) {
  res.json({
    status:200,
    message:"API Health Good"
  });
});

module.exports = router;