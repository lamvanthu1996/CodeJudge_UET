
var middleware = {};

middleware.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('login');
}

middleware.isAdmin = function isAdmin(req, res, next) {

    if (req.body.username == "admin") {
        return next();
    }
    res.redirect('home');
}

module.exports = middleware