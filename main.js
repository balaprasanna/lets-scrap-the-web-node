var request = require("request");
var cheerio = require("cheerio");

var pathOfTheJsonFile = "/Users/prasannav/Work/NUS-ISS/crawler/sample.json";

var pathOfTheOutputFile = "/Users/prasannav/Work/NUS-ISS/crawler/techsgio-emails.json"

var fs = require('fs');

fs.readFile(pathOfTheJsonFile, 'utf8', function (err, data) {
    if (err) throw err;
    var jsonData = JSON.parse(data);
    for (var i = 0; i < jsonData.length; ++i) {
        var key = jsonData[i].title;
        var url = jsonData[i].url;
        makeReqAndParse(i, url, key);
    }

});


function decodeHash(hashedEmail) {
    for (var e = '',
             r = '0x' + hashedEmail.substr(0, 2) | 0,
             n = 2;
         hashedEmail.length - n;
         n += 2) {
        e += '%' + ('0' + ('0x' + hashedEmail.substr(n, 2) ^ r).toString(16)).slice(-2);
    }
    return decodeURIComponent(e)
}


function makeReqAndParse(i, url, key) {
    console.log(i + " - "+ url +" - "+ key);

    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var email = decodeHash($("[data-cfemail]").attr("data-cfemail"));
            var content  = email +" , "+key +"\n "+ url+ "\n";
            // console.log(content);
            fs.appendFile(pathOfTheOutputFile, content, function (err) {
                if(err) { console.log(err)}
            })
        }
    });

}