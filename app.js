'use strict'

var express = require('express');
var path = require('path');

var index = require('./routes/index');
var data = require('./routes/data');
var app = express();

// using pug (aka jade) view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serve public content
app.use(express.static(path.join(__dirname, 'public')));

// define routes
app.use('/', index);
app.use('/data', data);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('404', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('404');
});

module.exports = app;
