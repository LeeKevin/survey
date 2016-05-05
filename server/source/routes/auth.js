(function () {
    'use strict';

    var Route = require('express').Router(),
        AuthController = require('../controllers/AuthController'),
        Authenticate = require('../middleware/Authenticate');

    module.exports = function (app) {
        Route.get('/token', Authenticate.refresh, AuthController.token);
        Route.get('/auth', Authenticate.local, AuthController.token);

        app.use('/api', Route);
    };
})();
