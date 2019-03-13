var express = require('express');
var controller = require('./level.controller');

var router = express.Router();

router.get('/day/:dayNumber', controller.index);

module.exports = router;
