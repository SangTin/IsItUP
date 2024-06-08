// Node Modules
let http = require('http');
let https = require('https');

// My Modules
let Regex = require('../util/Regex.js');

class Verifier {
    static verifyUrl(msg, match, callback) {
        // setup according url
        let request = http;
        let url = match[0];

        if (url.match(Regex.justVerifyRegex)) return;

        // verify if its https or doesn`t have protocol
        if (match[2] == "s") {
            request = https;
        } else if (match[1] == undefined) {
            url = "http://" + url;
        }

        console.log(`Got: ${url}`);

        let requestCompleted = false;

        const req = request.get(url, res => {
            if (!requestCompleted) {
                requestCompleted = true;
                console.log(`URL: ${url} || Status Code: ${res.statusCode}`);
                callback(msg, url, true, res.statusCode);
            }
        }).on('error', e => {
            if (!requestCompleted) {
                requestCompleted = true;
                console.log(`URL error: ${url}`);
                callback(msg, url, false);
            }
        });

        // Set timeout for the request
        req.setTimeout(10000, () => { // 10 seconds
            if (!requestCompleted) {
                requestCompleted = true;
                console.log(`URL timeout: ${url}`);
                req.abort();
                callback(msg, url, false);
            }
        });
    }
}

module.exports = Verifier;
