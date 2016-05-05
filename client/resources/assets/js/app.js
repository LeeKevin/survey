(function () {
    'use strict';

    var $ = require('jquery'),
        Backbone = require('backbone'),
        MainRouter = require('./routes/Main')
        ;

    Backbone.$ = $;

    $(document).ready(function () {
        //load routes
        var router = new MainRouter();

        Backbone.history.start();
    });
})();