var express = require('express');
var router = express.Router();


router.get('/level/:levelNumber', function (req, res, next) {

    var level = Number.parseInt(req.params.levelNumber);

    if (Number.isInteger(level)) {
        res.json({
            'level': level,
            'questions': [
                {
                    'question':'Que tal?',
                    'response': 'bien'
                }, {
                    'question':'Tienes fuego?',
                    'response': 'no'
                }, {
                    'question':'Como va la movida?',
                    'response': 'del tiempo'
                }
            ]
        });
    } else {
        res.status(400);
        res.json({
            'error': 'value not valid: ' + req.params.levelNumber,
        });
    }
});

module.exports = router;