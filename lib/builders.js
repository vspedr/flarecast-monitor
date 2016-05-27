'use strict'

var sync = require('synchronize');

var _this = this; //Saving reference to module's global scope

//This function will return date from given entry using regex
exports.stringParser = function(dataFromFTP, cb) {
    let dataFromFTPParsed = dataFromFTP.match(/\S+/g);
    cb(dataFromFTPParsed); //Callback
}

//Building Final JSON
exports.jsonBuilder = function(stringParsed, cb) {
    let json = [];

    _this.shortObject(stringParsed, function(shortJSON) {
        _this.longObject(stringParsed, function(longJSON) {
            _this.timeObject(stringParsed, shortJSON, longJSON, function(timeJSON) {
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
exports.shortObject = function(stringParsed, cb) {
    let shortJSON = [];
    sync.fiber(function() { //Using fiber to make this block sync
        for (let i = 105; i < stringParsed.length; i += 8) {
            shortJSON.push(stringParsed[i]);
        }
    });
    cb(shortJSON);
}

//Making shortJSON from "Long" column and then we will push it into final JSON
exports.longObject = function(stringParsed, cb) {
    let longJSON = [];
    sync.fiber(function() { //Using fiber to make this block sync
        for (let i = 106; i < stringParsed.length; i += 8) {
            longJSON.push(stringParsed[i]);
        }
    });
    cb(longJSON);
}

exports.timeObject = function(stringParsed, shortJSON, longJSON, cb) {
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
