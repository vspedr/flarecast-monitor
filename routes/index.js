var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Solar X-Ray Flux Monitor'
    });
});

module.exports = router;
