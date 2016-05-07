var express = require('express');

var app = express();

app.set('views', './views');
app.set('view engine', 'pug');


app.get('/', function(req, res) {
  

  
  res.render('index', {
    title: 'Solar X-Ray Flux Monitor'
  });
});

app.listen(8080);