'use strict';

var Route = require('express').Router(),
    UsersController = require('../controllers/UsersController'),
    VerifyToken = require('../middleware/VerifyToken')
;

module.exports = function (app) {
    Route.use(VerifyToken);

    /**
     * Define routes here. You can create other files in this directory
     * which will be automatically loaded into the application.
     * Be sure to copy the basic structure of this file.
     */

    Route.get('/me', UsersController.me);

    app.use('/api/users', Route);
};
