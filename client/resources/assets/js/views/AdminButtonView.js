'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Util = require('../lib/util');

module.exports = Backbone.View.extend({
    events: {
        "click": "hover",
        "mouseover": "mouseover",
        "mouseout": "mouseout"
    },
    initialize: function () {
        this.render();
    },
    render: function () {
        $(this.el).css('z-index', Util.getMaxZIndex());
        return this;
    },
    hover: function () {
        if ($(this.el).hasClass('hover')) {
            $(this.el).removeClass('hover');
        } else {
            $(this.el).addClass('hover');
        }
        this.goTo('admin-login');
    },
    mouseover: function () {
        $(this.el).addClass('hover');
    },
    mouseout: function () {
        $(this.el).removeClass('hover');
    }
});