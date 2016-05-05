(function () {
    'use strict';

    var NoAuthenticationError = require('../errors/NoAuthenticationError'),
        InvalidCredentialsError = require('../errors/InvalidCredentialsError'),
        GenericError = require('../errors/GenericError'),
        JWT = require('jsonwebtoken'),
        User = require('../models').User,
        auth = require('../../config/auth')
        ;

    module.exports.refresh = function (req, res, next) {
        var config, authorization;

        authorization = req.get('authorization');
        if (!authorization) throw new NoAuthenticationError();

        config = req.app.get('auth');
        // If token not passed with Bearer scheme
        if (!(authorization.toLowerCase().slice(0, "bearer".length) === "bearer")) {
            throw new NoAuthenticationError();
        }
        // Passed in existing token to refresh
        var token = authorization.slice("bearer".length + 1);

        JWT.verify(token, config.token.secret, function (err, userData) {
            if (err) {
                return next(new GenericError('Authentication Error', 500, 'There was an error verifying the provided token.'));
            }

            User.findById(userData.id).then(function (user) {
                if (!user) {
                    return next(new GenericError('Authentication Error', 500, 'There was an error verifying the provided token.'));
                }

                req.user = user;
                return next();
            }).catch(next);
        });
    };

    module.exports.local = function (req, res, next) {
        var authorization = req.get('authorization');
        if (!authorization) throw new NoAuthenticationError();

        // Else check for credentials in Basic scheme
        var credentials = getHeaderCredentials(authorization);
        User.findOne({where: {username: credentials.username}}).then(function (user) {
            if (!user) {
                return next(new InvalidCredentialsError());
            }

            if (!user.checkPassword(credentials.password)) return next(new InvalidCredentialsError());

            req.user = user;
            return next();
        }).catch(next);
    };

    var getHeaderCredentials = function (authorization) {
        if (!(authorization.toLowerCase().slice(0, "basic".length) === "basic")) throw new NoAuthenticationError();
        var credentials = new Buffer(authorization.slice("basic".length + 1), 'base64').toString().split(/:(.+)?/);
        if (credentials.length < 2) throw new NoAuthenticationError();

        return {
            username: credentials[0],
            password: credentials[1]
        };
    };

})();
