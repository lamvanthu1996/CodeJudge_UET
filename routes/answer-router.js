var express = require('express');
var router = express.Router();
var Answer = require('../models/answer');


router.post('/create', function (req, res, next) {
    var answer = {
        title: req.body.title,
        statement: req.body.statement,
        serverInput: req.body.serverInput,
        serverOutput: req.body.serverOutput,
        sampleInput: req.body.sampleInput,
        sampleOutput: req.body.sampleOutput
    };

    Answer.create(answer, function (err, answer) {
        if (err) {
            res.json({
                error: err
            })
        }
        res.json({
            "message": 'Answer created successfully',
            'answer': answer
        })
    })
});

router.get('/:id', function (req, res, next) {
    Answer.get({ _id: req.params.id }, function (err, answer) {
        if (err) {
            res.json({
                "error": err
            })
        }
        res.json({
            'answer': answer
        })
    })
});

router.put('/update/:id', function (req, res, next) {

    var answer = {
        title: req.body.title,
        statement: req.body.statement,
        serverInput: req.body.serverInput,
        serverOutput: req.body.serverOutput,
        sampleInput: req.body.sampleInput,
        sampleOutput: req.body.sampleOutput
    };

    Answer.update({ _id: req.params.id }, answer, function (err, answer) {
        if (err) {
            res.json({
                "error": err
            })
        }
        res.json({
            "message": 'Answer updated successfully'
        })
    })
});

router.delete('/remove/:id', function (req, res, next) {
    Answer.delete({ _id: req.params.id }, function (err, answer) {
        if (err) {
            res.json({
                "error": err
            })
        }
        res.json({
            "message": 'Answer deleted successfully'
        })
    })
});

router.get('/', function (req, res, next) {
    Answer.get({}, function (err, answers) {
        if (err) {
            res.json({
                "error": err
            })
        }
        res.json({
            'answers': answers
        })
    })
});

module.exports = router;