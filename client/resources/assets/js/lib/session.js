'use strict';

var Cookies = require('js-cookie'),
    $ = require('jquery'),
    Util = require('./util'),
    userId;

require('../vendor/evercookie');

var ecookie = new evercookie();

/**
 * Utility module to manage user sessions
 */
module.exports = {
    getAdminToken: function () {
        return Cookies.get('token') ? atob(Cookies.get('token')) : false;
    },
    setAdminToken: function (token) {
        Cookies.remove('token');
        Cookies.set('token', btoa(token));
    },
    removeAdminToken: function () {
        Cookies.remove('token');
    },
    login: function (credentials, next) {
        $.ajax({
            method: 'GET',
            url: Util.getServerLocation('auth'),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(credentials.username + ":" + credentials.password));
            },
            success: (function (res, statusText, xhr) {
                if (res.error || !res.access_token) {
                    return next(false, xhr.status || 401, res.error.description || 'Login failed.');
                }
                this.setAdminToken(res.access_token);
                if (typeof next === 'function') next(true);
            }).bind(this),
            error: function (res) {
                try {
                    var error = JSON.parse(res.responseText),
                        errorDescription = error.error.description;
                } catch (e) {

                }
                return next(false, res.status || 401, errorDescription || 'Login failed.');
            }
        });
    },
    checkToken: function (next) {
        $.ajax({
            method: 'GET',
            url: Util.getServerLocation('token'),
            beforeSend: (function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + this.getAdminToken());
            }).bind(this),
            success: (function (res, statusText, xhr) {
                if (res.error || !res.access_token) {
                    return next(false);
                }
                this.setAdminToken(res.access_token);
                if (typeof next === 'function') next(true);
            }).bind(this),
            error: function () {
                return next(false);
            }
        });
    },
    setUser: function (user_id) {
        ecookie.set('uid', btoa(user_id));
        userId = btoa(user_id);
    },
    getUser: function (cb) {
        if (userId) return cb(atob(userId));
        ecookie.get('uid', function (user_id) {
            userId = user_id;
            cb(atob(user_id));
        });
    }
};
