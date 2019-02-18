var express = require('express');
var router = express.Router();
var _ = require('lodash');
var admin = require("firebase-admin");
var database = admin.firestore();

router.get('/level/:levelNumber', function (req, res, next) {

    var level = Number.parseInt(req.params.levelNumber);

    if (Number.isInteger(level)) {
        var questionsRef = database.collection("questions");
        questionsRef.where('level', '==', level).get()
            .then(querySnapshot => {
                var question = querySnapshot.docs.map(function (documentSnapshot) {
                    return documentSnapshot.data();
                });

                var data = {};
                data.questions = question;
                data.level = level;
                res.json(data);
            })
            .catch(err => {
                console.log('Error getting document', err);
                res.status(400);
                res.json({
                    'error': "The read failed: " + err
                });
            });

    } else {
        res.status(400);
        res.json({
            'error': 'value not valid: ' + req.params.levelNumber,
        });
    }
});

router.post('/', function (req, res) {

    var questions = req.body.questions;

    _.forEach(questions, function (value) {
        if (value.status == 'fail') {
            console.log(value + "Mail");
            // value.id a level 1
        } else {
            console.log(value + "Bien");
            // value.id a level ++
        }
    });

    res.json({
        'level': level,
        'status': 'updated'
    });
});

module.exports = router;