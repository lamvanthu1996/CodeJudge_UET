var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


mongoose.connect('mongodb+srv://16020973:16020973@uetcodejudge-an2qi.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

app.use(session({
    secret: 'CodeJudge',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));
// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

//ROUTER
var adminRouter = require('./routes/admin-routers');
app.use('/admin', adminRouter);

var userRouter = require('./routes/user-routes');
app.use('/user', userRouter);

var problemRouter = require('./routes/proplem-routers');
app.use('/problem', problemRouter);

var answerRouter = require('./routes/answer-router');
app.use('/answer', answerRouter);

var authRouter = require('./routes/auth-routes');
app.use('/', authRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

// Start the server
var port = 3000;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});