var express = require("express");
var open = require("open");
var fs = require("fs");
var app = express();

app.configure(function() {
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.static(__dirname + '/'));
    app.use(app.router);
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.get('*', function(req, res) {
    res.redirect('/jatabase.html');
});

app.post('/open', function(req, res) {
    console.log('trying to open target: ' + req.body.target);
    open(req.body.target);
    res.json('');
});

app.post('/openTimesheet', function(req, res) {
    console.log('trying to open timesheet');
    open("http://bing.com/","iexplore");
    res.json('');
});

app.post('/save', function(req, res) {
    console.log('Trying to save...');
    fs.writeFile(__dirname + "/data/jobs.js", "jobs=" + JSON.stringify(req.body), function(err) {
        if (err) {
            console.log(err);
            res.json('Failed :(');
        } else {
            console.log("The file was saved!");
            res.json('');
        }
    });

});

app.listen(11434, function() {
    console.log("I'm alive");
});