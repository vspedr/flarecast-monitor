var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Solar X-Ray Flux Monitor'
  });
});

module.exports = app;
