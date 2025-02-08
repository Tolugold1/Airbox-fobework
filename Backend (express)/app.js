var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var { HTTPError } = require("./utils/error");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err instanceof HTTPError ) {
    return res.status(err.statusCode).json({
      title: err.title,
      message: err.message,
      status: res.statusCode
    });
  }

  // handle duplicate error from mongoose
  if (err.code == 11000) {
    return res.status(400).json({
      title: "Duplicate Field",
      message: `${Object.keys(err.keyValue)} already exists`
    })
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
