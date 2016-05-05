'use strict';

/**
 * Create an instance of the app, and pass it to the app bootstrap.
 */

var express = require('express'),
    config = require('./config/app'),
    auth = require('./config/auth'),
    models = require('./source/models'),
    app = express();

models.sequelize.sync().then(function () {
    app.set('auth', auth);
    app.set('config', config);

    require("./source/bootstrap")(app);
    var listener = app.listen(config['port'] || 5000, function () {
        console.log('Listening on port ' + listener.address().port);
    });
});