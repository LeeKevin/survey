'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Session = require('../lib/session'),
    Util = require('../lib/util');

module.exports = Backbone.Model.extend({
    urlRoot: Util.getServerLocation('surveys'),
    idAttribute: 'id',
    initialize: function () {
    },
    answer: function (option_id, success) {
        var model = this;
        Session.getUser(function (user_id) {
            $.ajax({
                method: 'POST',
                data: {
                    option_id: option_id,
                    user_id: user_id
                },
                url: Util.getServerLocation('surveys/' + model.attributes.id + '/answer'),
                success: function () {
                    if (typeof success == 'function') success();
                },
                error: function (res) {
                    try {
                        var error = JSON.parse(res.responseText),
                            errorDescription = error.error.description;
                    } catch (e) {

                    }
                    console.error('Status ' + (res.status > 0 ? res.status : 500) + ': ' + (errorDescription ? errorDescription : 'Server error'));
                }
            });
        });
    }
}, {
    //static methods
    fetchRandom: function (user_id, success) {
        var model = new this();
        $.ajax({
            data: {user_id: user_id},
            url: Util.getServerLocation('surveys/random'),
            success: function (res) {
                if (res.user_id) {
                    Session.setUser(res.user_id);
                }

                if (res.question) {
                    model.set(res.question);
                    if (typeof success == 'function') success(model);
                }
            },
            error: function (res) {
                try {
                    var error = JSON.parse(res.responseText),
                        errorDescription = error.error.description;
                } catch (e) {

                }
                console.error('Status ' + (res.status > 0 ? res.status : 500) + ': ' + (errorDescription ? errorDescription : 'Server error'));
            }
        });
    }
});