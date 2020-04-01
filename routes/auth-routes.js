var express = require('express');
var router = express.Router();

var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');

var secret = 'code-judge';
// GET route for reading data
router.get('/', function (req, res, next) {
   res.render('home');
});

router.get('/login', function (req, res) {
   res.render('login', {
      title: 'Login'
   });
})


router.post('/login', function (req, res) {

   User.findOne({ username: req.body.username }, function (err, user) {
      if (err) { return res.status(500).send('Error on the server.'); }
      if (!user) { return res.status(404).send('No user found.'); }

      user.comparePassword(req.body.password, function (err, isMatch) {
         if (err) {
            return res.status(500).send('Error on the server.');
         }
         if (!isMatch) {
            return res.status(401).send({ auth: false, token: null });
         }
         // create a token
         var token = jwt.sign({ id: user._id }, secret, {
            expiresIn: 86400 // expires in 24 hours
         });

         if (user.username === 'admin') {
            res.redirect('admin');
         }
         else {
            res.redirect('user/' + user.username);
         }    
         // return the information including token as JSON
         //res.status(200).send({ auth: true, token: token });
      });
   });
});


router.get('/logout', function (req, res) {
   res.status(200).send({ auth: false, token: null });
});

router.get('/register', function (req, res) {
   res.render('register', {
      title: 'Register'
   });
});


router.post('/register', function (req, res) {
   var user = {
      username: req.body.username,
      password: req.body.password
   };

   User.create(user, function (err, newUser) {

      if (err) return res.status(500).send('There was a problem registering the user`.');

      // if user is registered without errors
      // create a token
      var token = jwt.sign({ "id": newUser._id }, secret, {
         expiresIn: 86400 // expires in 24 hours
      });

      res.status(200).send({ auth: true, token: token });
   });

});

module.exports = router;