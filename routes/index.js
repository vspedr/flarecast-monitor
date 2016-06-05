var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function(req, res) {
    res.io.emit("data", "hey, it's me! I can handle data and display it into graphic!! o/"); //I will use socket.io to make graphic realtime
    request('http://localhost:8080/api/long', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          console.log(body);
            res.render('index', {
                title: 'Solar X-Ray Flux Monitor',
                data: body
            });
        }
    });
});

module.exports = router;
