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
                    //os dados começam na posição 99 do array
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

//Essa função irá retornar a string de entrada parseada utilizando um regex
var stringParser = function(dataFromFTP, cb) {
    let dataFromFTPParsed = dataFromFTP.match(/\S+/g);
    cb(dataFromFTPParsed); //Callback da função
}

//Building Final JSON
var jsonBuilder = function(stringParsed, cb) {
    let json = [];
    let data = {
        "data": stringParsed[99] + "/" + stringParsed[100] + "/" + stringParsed[101]
    };

    shortObject(stringParsed, function(shortJSON) {
        longObject(stringParsed, function(longJSON) {
            json.push(data);
            json.push(shortJSON);
            json.push(longJSON);
            cb(json);
        });
    });
}

//Making shortJSON from "Short" column and then we will push it into final JSON.
var shortObject = function(stringParsed, cb) {
    let data = [];
    sync.fiber(function() { //Using fiber to make this block sync
        for (let i = 105; i < stringParsed.length; i += 8) {
            data.push(stringParsed[i]);
        }
    });
    let shortJSON = {"short": data};
    cb(shortJSON);
}

//Making shortJSON from "Long" column and then we will push it into final JSON.
var longObject = function(stringParsed, cb) {
    let data = [];
    sync.fiber(function() { //Using fiber to make this block sync
        for (let i = 106; i < stringParsed.length; i += 8) {
            data.push(stringParsed[i]);
        }
    });
    let longJSON = {"long": data};
    cb(longJSON);
}

module.exports = router;
