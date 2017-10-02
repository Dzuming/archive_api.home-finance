const fs = require('fs');
const join = require('path').join;
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const models = join(__dirname, 'app/models');
const port = 80;
const http = require('http');
const https = require('https');
const redirectHttps = require('redirect-https');
const PROD = true;
const lex = require('greenlock-express').create({
    server: PROD ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging',

    approveDomains: (opts, certs, cb) => {
        if (certs) {
            // change domain list here
            opts.domains = ['https://127.0.0.1', 'https://finance-system.eu/']
            opts.domains = certs.altnames;
        } else {
            // change default email to accept agreement
            opts.email = 'dawidpoliszak@op.pl';
            opts.agreeTos = true;
        }
        cb(null, { options: opts, certs: certs });
    }
});
const middlewareWrapper = lex.middleware;

module.exports = app;
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'access-control-allow-methods, access-control-allow-origin, Content-Type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)));

require('./config/routes')(app);
connect()
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);

function listen() {
    http.createServer(lex.middleware(redirectHttps())).listen(port);
    console.log('Express app started on port ' + port);
}


function connect() {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    return mongoose.connect(config.database).connection;
}
https.createServer(
    lex.httpsOptions,
    middlewareWrapper(app)
).listen(443);