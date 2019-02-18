var express = require('express');
var router = express.Router();
var bot = require('../bot');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/' + bot.token, function(req, res) {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

module.exports = router;
