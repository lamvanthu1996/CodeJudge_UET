var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var fs = require('fs-extra');

var User = require('../models/user');
var Problem = require('../models/problem');
var Answer = require('../models/answer');

var ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store, {
    freeRetries: 50,
    lifetime: 3600
});

router.post('/', bruteforce.prevent, function (req, res) {

    var language = req.body.language;
    var code = req.body.code;
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            res.json({
                "error": err
            })
            return;
        }

        Problem.findOne({ title: req.body.problem }, function (err, problem) {
            if (err) {
                res.json({
                    "error": err
                })
                return;
            }

            var path = __dirname + '/';
            var folder = path + 'temp/' + random(10);
            fs.mkdirSync(folder);

            var userInput = req.body.stdin;
            var inputFile = `${folder}/input.txt`;
            fs.writeFileSync(inputFile, userInput);

            switch (language) {
                case 'java':
                    var mainFile = `${folder}/Main.java`;
                    fs.writeFileSync(mainFile, code);
                    var command = `docker run --rm -v ${folder}:${folder} codejudgeuet_java javac ${mainFile} ${folder}/output ${folder}/input.txt`;
                    break;
                case 'js':
                    var mainFile = `${folder}/main.js`;
                    fs.writeFileSync(mainFile, code);
                    var command = `docker run --rm -v ${folder}:${folder} codejudgeuet_js node ${mainFile} ${folder}/output ${folder}/input.txt`;
                    break;
                case 'php':
                    var mainFile = `${folder}/main.php`;
                    fs.writeFileSync(mainFile, code);
                    var command = `docker run --rm -v ${folder}:${folder} codejudgeuet_php php ${mainFile} ${folder}/output ${folder}/input.txt`;
                    break;
                case 'python':
                    var mainFile = `${folder}/main.py`;
                    fs.writeFileSync(mainFile, code);
                    var command = `docker run --rm -v ${folder}:${folder} codejudgeuet_python python ${mainFile} ${folder}/output ${folder}/input.txt`;
                    break;
                default:
                    res.json({
                        stdout: "",
                        error: "language not support",
                    });
                    return;
            }

            exec(command, (error, exec_time, stderr) => {
                var stdout = fs.readFileSync(`${folder}/output`, 'utf8');

                var answer = {
                    user: user._id,
                    problem: problem._id,
                    lang: language,
                    sourceCode: code,
                    error: stderr,
                    output: stdout
                };
                Answer.create(answer, function (err, answer) {
                    if (err) {
                        res.json({
                            error: err
                        })
                        return;
                    }

                    fs.remove(folder, (err) => { });

                    res.json({
                        stdout: stdout,
                        error: stderr,
                        time: exec_time
                    });

                    user.solved.addToSet(problem._id);
                    user.answers.addToSet(answer._id);
                    user.save();
                });
            });
        });
    });
});

function random(size) {
    //returns a crypto-safe random
    return require('crypto').randomBytes(size).toString('hex');
}

module.exports = router;