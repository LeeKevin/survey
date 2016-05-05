'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    SurveyQuestion = require('../models/SurveyQuestion'),
    Session = require('../lib/session'),
    Util = require('../lib/util');

module.exports = Backbone.Collection.extend({
    model: SurveyQuestion,
    url: function () {
        return Util.getServerLocation('surveys') + '?' + $.param(this.params);
    },
    initialize: function (models, options) {
        var params = {};
        if (options) {
            if (typeof options.active != 'undefined') params.active = options.active;
        }
        this.params = params;
    },
    fetch: function (options) {

        //pass options
        options.headers = {Authorization: 'Bearer ' + Session.getAdminToken()};

        if (!options.error) options.error = function (res) {
            console.error(res, "Error fetching survey questions from the server.");
        };

        //Call Backbone's fetch
        return Backbone.Collection.prototype.fetch.call(this, options);
    }
});
