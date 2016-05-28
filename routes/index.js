var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.io.emit("data", "hey, it's me! I can handle data and display it into graphic!! o/"); //I will use socket.io to make graphic realtime
    res.render('index', {
        title: 'Solar X-Ray Flux Monitor'
    });
});

module.exports = router;
