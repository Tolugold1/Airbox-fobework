var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
const session = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const bookingRouter = require("./routes/bookings.router");
const businessAnalyticsRouter = require("./routes/business.analytics.router");
const clientRouter = require("./routes/client.router");
const businessRouter = require("./routes/business.router")

var { HTTPError } = require("./utils/error");
var cors = require("cors");
var { connectDB } = require("./utils/connectDB")
var app = express();
var mongoose = require("mongoose");
const passport = require("passport");


// connect to the database.
connectDB();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:8000" ], credentials: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    name: "session_id",
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET_KEY,
    // cookie: {
    //   maxAge: 1000 * 60 * 60 * 2, // 2 hours
    //   secure: false,
    //   httpOnly: true,
    // }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/businessAnalytics', businessAnalyticsRouter);
app.use('/api/client', clientRouter);
app.use('/api/business', businessRouter);

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
