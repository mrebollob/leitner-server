var express = require('express');
var router = express.Router();
var _ = require('lodash');
var admin = require("firebase-admin");
var database = admin.firestore();
var questionsRef = database.collection("questions");

router.get('/level/:levelNumber', function (req, res, next) {

    var level = Number.parseInt(req.params.levelNumber);

    if (Number.isInteger(level)) {
        questionsRef.where('level', '==', level).get()
            .then(querySnapshot => {
                var question = querySnapshot.docs.map(function (documentSnapshot) {
                    var result = documentSnapshot.data();
                    result.id = documentSnapshot.id;
                    return result;
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

router.put('/', function (req, res) {

    var question = req.body.question;
    var id = question.id;
    var data = {
        'level': question.level,
        'question': question.question,
        'response': question.response
    };

    questionsRef.doc(id).set(data);
    res.json({
        'status': 'updated',
        'question': data
    });
});

module.exports = router;