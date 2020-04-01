var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Problem = require('../models/problem');
var Answer = require('../models/answer');


router.get('/user', function (req, res, next) {
    User.get({}, function (err, users) {
        if (err) {
            res.json({
                "error": err
            })
        }
        res.json({
            "users": users
        })
    })
});

router.get('/problem', function (req, res, next) {
    Problem.get({}, function (err, problems) {
        if (err) {
            res.json({
                "error": err
            })
        }
        res.json({
            "problems": problems
        })
    })
});

router.get('/answer', function (req, res, next) {
    Answer.get({}, function (err, answers) {
        if (err) {
            res.json({
                "error": err
            })
        }
        res.json({
            "answers": answers
        })
    })
});

router.get('user/:username', function (req, res, next) {
    User.get({ username: req.params.username }, function (err, user) {
        if (err) {
            res.json({
                "error": err
            })
        }
        res.json({
            "user": user
        })
    })
});

router.get('problem/:title', function (req, res, next) {
    Problem.get({ title: req.params.title }, function (err, problem) {
        if (err) {
            res.json({
                "error": err
            })
        }
        res.json({
            "problem": problem
        })
    })
});

router.get('answer/:id', function (req, res, next) {
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

router.get('/', function (req, res, next) {
    res.send('Admin page');
});

module.exports = router;