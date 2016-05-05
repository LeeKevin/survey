'use strict';

/**
 * Specify which middleware to load on application initialization.
 * These will be automatically used to filter all requests.
 */

var methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    Util = require('../util/util');

module.exports = function (app) {
    var config = app.get('config');
    //CORS
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', config.cors && config.cors.AllowOrigin && Util.isArray(config.cors.AllowOrigin) ? config.cors.AllowOrigin.join() : req.headers.origin || "*");
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");

        if (req.method === 'OPTIONS') {
            return res.end();
        }

        next();
    });

    //Accept overriden method sent with 'X-HTTP-Method-Override' header or by '_method' in POST data
    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(methodOverride('_method'));
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));
    app.use(bodyParser.json()); //populate req.body with parsed json
};
