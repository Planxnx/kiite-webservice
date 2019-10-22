const express = require('express');
const router = express.Router();

router.get('/health', function(req, res, next) {
  res.json({
    status:200,
    message:"API Health Good"
  });
});

module.exports = router;