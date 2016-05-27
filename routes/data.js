var express = require("express");
var request = require("request");
var fs = require("fs");
var sync = require('synchronize')
var Client = require("ftp");

var router = express.Router();

router.get('/', function(req, res) {
    var c = new Client();
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
                stringParser(dataFile, function(dataParsed) {
                    //important data starts in position "99"!
                    jsonBuilder(dataParsed, function(json) {
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

})

//This function will return date from given entry using regex
var stringParser = function(dataFromFTP, cb) {
    let dataFromFTPParsed = dataFromFTP.match(/\S+/g);
    cb(dataFromFTPParsed); //Callback da função
}

//Building Final JSON
var jsonBuilder = function(stringParsed, cb) {
    let json = [];

    shortObject(stringParsed, function(shortJSON) {
        longObject(stringParsed, function(longJSON) {
            timeObject(stringParsed, shortJSON, longJSON, function(timeJSON) {
                let data = {
                    "date": stringParsed[99] + "/" + stringParsed[100] + "/" + stringParsed[101],
                    "data": timeJSON
                };
                json.push(data);
                cb(json);
            });
        });
    });
}

//Making shortJSON from "Short" column and then we will push it into final JSON
var shortObject = function(stringParsed, cb) {
    let shortJSON = [];
    sync.fiber(function() { //Using fiber to make this block sync
        for (let i = 105; i < stringParsed.length; i += 8) {
            shortJSON.push(stringParsed[i]);
        }
    });
    cb(shortJSON);
}

//Making shortJSON from "Long" column and then we will push it into final JSON
var longObject = function(stringParsed, cb) {
    let longJSON = [];
    sync.fiber(function() { //Using fiber to make this block sync
        for (let i = 106; i < stringParsed.length; i += 8) {
            longJSON.push(stringParsed[i]);
        }
    });
    cb(longJSON);
}

var timeObject = function(stringParsed, shortJSON, longJSON, cb) {
    let timeJSON = [];

    sync.fiber(function() { //Using fiber to make this block sync
        for (let i = 102; i < stringParsed.length; i += 8) {
            timeJSON.push(stringParsed[i]);
        }
        for (let i = 0; i < timeJSON.length; i++) {
            timeJSON[i] = {
                "time": timeJSON[i],
                "short": shortJSON[i],
                "long": longJSON[i]
            };
        }
        cb(timeJSON);
    });
}

module.exports = router;
