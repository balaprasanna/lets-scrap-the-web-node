var request = require("request");
var cheerio = require("cheerio");
var async = require("async");

var pathOfTheJsonFile = "/Users/prasannav/Work/NUS-ISS/crawler/techsgio-spider-startup-response.json";
var pathOfTheOutputFile = "/Users/prasannav/Work/NUS-ISS/crawler/techsgio-emails-big.json"
    //"/Users/prasannav/Work/NUS-ISS/crawler/techsgio-emails-001.json"

var fs = require('fs');

var q = async.queue(function (task, callback) {
    console.log('URL : ' + task.url + task.key);
    var url = task.url;
    var key = task.key;
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);

            var email = decodeHash($("[data-cfemail]").attr("data-cfemail"));

            var website = $('.mb15').last().children().last().children().first().text()
            var content  = email +" , "+website +" , " + key +"\n";
            console.log(content);
            fs.appendFile(pathOfTheOutputFile, content, function (err) {
                if(err) { console.log(err)}
            });
            callback(null, url);
        }
    });

}, 1);


// assign a callback
q.drain = function() {
    console.log('all items have been processed');
}

function AddTaskToQueue(url, key) {
    q.push({url: url, key: key}, function (err, url) {
        if(err) return;
        console.log('finished processing url' + url);
    });
}

fs.readFile(pathOfTheJsonFile, 'utf8', function (err, data) {
    if (err) throw err;
    var jsonData = JSON.parse(data);
    for (var i = 0; i < jsonData.length; ++i) {
        var key = jsonData[i].title;
        var url = jsonData[i].url;
        //makeReqAndParse(url, key);
        AddTaskToQueue(url,key);
    }

});


function decodeHash(hashedEmail) {
    for (var e = '', r = '0x' + hashedEmail.substr(0, 2) | 0, n = 2; hashedEmail.length - n; n += 2) {
        e += '%' + ('0' + ('0x' + hashedEmail.substr(n, 2) ^ r).toString(16)).slice(-2);
    }
    return decodeURIComponent(e)
}




function makeReqAndParse(url, key) {
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            // console.log($);
            var email = decodeHash($("[data-cfemail]").attr("data-cfemail"));

            var content  = email +" , "+key +"\n";
            console.log(content);
            fs.appendFile(pathOfTheOutputFile, content, function (err) {
                if(err) { console.log(err)}
            })
        }
    });
}