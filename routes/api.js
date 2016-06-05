var express = require("express");
var fs = require("fs");
var Client = require("ftp");
var builder = require("../lib/builders.js");

var router = express.Router();

router.get('/', function(req, res) {
    var c = new Client();

    //res.io.emit("text", "users");

    c.on('ready', function() {
        c.get('/pub/lists/xray/Gp_xr_1m.txt', function(err, stream) {
            if (err) throw err;
            const chunks = [];

            stream.on("data", function(chunk) {
                chunks.push(chunk);
            });

            stream.on("end", function() {
                var dataFile = (Buffer.concat(chunks)).toString();
                //console.log(dataFile);
                builder.stringParser(dataFile, function(dataParsed) {
                    //important data starts in position "99"!
                    builder.jsonBuilder(dataParsed, function(json) {
                        res.send(json);
                    });
                });
                //res.send(dataFile);
            });

            stream.once('close', function() {
                c.end();
            });
            //stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
        });
    });
    c.connect({
        'host': 'ftp.swpc.noaa.gov',
    });
});

router.get('/long', function(req, res) {
    var c = new Client();

    //res.io.emit("text", "users");

    c.on('ready', function() {
        c.get('/pub/lists/xray/Gp_xr_1m.txt', function(err, stream) {
            if (err) throw err;
            const chunks = [];

            stream.on("data", function(chunk) {
                chunks.push(chunk);
            });

            stream.on("end", function() {
                var dataFile = (Buffer.concat(chunks)).toString();
                //console.log(dataFile);
                builder.stringParser(dataFile, function(dataParsed) {
                    //important data starts in position "99"!
                    builder.longObject(dataParsed, function(json) {
                        res.send(json);
                    });
                });
                //res.send(dataFile);
            });

            stream.once('close', function() {
                c.end();
            });
            //stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
        });
    });
    c.connect({
        'host': 'ftp.swpc.noaa.gov',
    });
});

module.exports = router;
