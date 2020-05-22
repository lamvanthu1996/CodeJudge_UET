var jwt = require('jsonwebtoken');
var config = require('../config.json');

var middleware = {};

middleware.isLoggedIn = function (req, res, next) {

    if (req.headers && req.headers.authorization) {
        jwt.verify(req.headers.authorization, config.secret, function (err, decode) {
            if (err) { req.user = undefined; }
            req.user = decode;
            next();
        });

    } else {
        res.redirect('login');
    }
}

middleware.isAdmin = function isAdmin(req, res, next) {
    if (req.headers && req.headers.authorization) {
        jwt.verify(req.headers.authorization, config.secret, function (err, decode) {
            if (err) { req.user = undefined; }
            if (decode.role == 'admin') {
                req.user = decode;
                next();
            } else {
                res.redirect('login');
            }
        });
    } else {
        res.redirect('login');
    }
}

module.exports = middleware