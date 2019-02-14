var express = require('express');
var router = express.Router();

// from https://ncase.me/remember/sims/leitner/leitner.js
var CALENDAR = [
	[2,1],	[3,1],	[2,1],	[4,1], [2,1],	[3,1],	[2,1],	[1], 
	[2,1],	[3,1],	[2,1],	[5,1], [4,2,1],	[3,1],	[2,1],	[1], 
	[2,1],	[3,1],	[2,1],	[4,1], [2,1],	[3,1],	[2,1],	[6,1], 
	[2,1],	[3,1],	[2,1],	[5,1], [4,2,1],	[3,1],	[2,1],	[1],
	[2,1],	[3,1],	[2,1],	[4,1], [2,1],	[3,1],	[2,1],	[1], 
	[2,1],	[3,1],	[2,1],	[5,1], [4,2,1],	[3,1],	[2,1],	[1],
	[2,1],	[3,1],	[2,1],	[4,1], [2,1],	[3,1],	[2,1],	[7,1], 
	[2,1],	[3,1],	[6,2,1],[5,1], [4,2,1],	[3,1],	[2,1],	[1], 
];

router.get('/day/:dayNumber', function (req, res, next) {

    var day = Number.parseInt(req.params.dayNumber);

    if (Number.isInteger(day)) {
        var d = (day-1)%CALENDAR.length;
        res.json({
            'day': day,
            'levels': CALENDAR[d]
        });
    } else {
        res.status(400);
        res.json({
            'error': 'value not valid: ' + req.params.dayNumber,
        });
    }
});

module.exports = router;