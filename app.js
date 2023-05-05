var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var flash = require('connect-flash');

// 
var indexRouter = require('./routes/login');
var dashRouter = require('./routes/dashboard');
var manageFamiliesRouter = require('./routes/manageFamilies');
var manageEventsRouter = require('./routes/manageEvents');
var manageHomeRouter = require('./routes/manageHome');
var manageLoginReport = require('./routes/manageLoginReport');
var manageRegistrationRouter = require('./routes/manageRegistration');
var manageRequestsRouter = require('./routes/manageRequests');
// 

var app = express();

app.use(session({
  secret: 'gsbpsweb',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

// Flash Module.
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/view_family_members', express.static(path.join(__dirname, 'public')));

// 
app.use('/', indexRouter);
app.use('/', dashRouter);
app.use('/', manageFamiliesRouter);
app.use('/', manageEventsRouter);
app.use('/', manageHomeRouter);
app.use('/', manageLoginReport);
app.use('/', manageRegistrationRouter);
app.use('/', manageRequestsRouter);
// 

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;