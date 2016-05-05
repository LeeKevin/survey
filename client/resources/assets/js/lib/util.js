'use strict';

var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    $ = require('jquery'),
    Partials = require('../../partials/partials'),
    config = require('config');

Handlebars.registerHelper("percent", function (lvalue, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    var decimal = lvalue / rvalue;
    if (isNaN(decimal)) decimal = 0;

    return (decimal * 100) + '%';
});

/**
 * Utility module for helper/miscellaneous methods.
 */
module.exports = {
    /**
     * Retrieves the server location for a give uri.
     * If an api property is provided in the server config, this is added to the returned url and safely ignored
     * in the passed uri.
     *
     * @param uri
     * @returns {string}
     */
    getServerLocation: function (uri) {
        var apiString = config['server']['api'] ? this.trim(config['server']['api'], '/') + '/' : '';

        return 'http://' + config['server']['url'] +
            (config['server']['port'] ? ':' + config['server']['port'] : '') +
            '/' + apiString + this.trim(uri, apiString);
    },
    registerPartial: function (partial_name) {
        if (!Partials.hasOwnProperty(partial_name)) return;
        var partial = Partials[partial_name];

        return Handlebars.registerPartial(partial_name, partial);
    },
    renderPartial: function (partial_name, params) {
        if (!Partials.hasOwnProperty(partial_name)) return '';
        if (typeof params != 'object') params = {};
        var partial = Partials[partial_name];

        return Handlebars.compile(partial)(params);
    },
    getScrollBarWidth: function () {
        var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
            widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
        $outer.remove();
        return 100 - widthWithScroll;
    },
    timeSince: function (date) {
        date = (date instanceof Date) ? date : (typeof date == 'string' ? new Date(date) : null);

        if (!date) return '';

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    },
    trim: function (str, character, escape) {
        if (typeof escape === 'undefined') escape = true;
        if (typeof character === 'undefined') character = ' ';
        var escapedCharacter = escape ? this.escapeRegExp(character) : character;
        return str.replace(new RegExp("^" + escapedCharacter + "+|" + escapedCharacter + "+$", "gm"), '');
    },
    escapeRegExp: function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    recursiveMergeObjects: function () {
        var deepExtend = $.extend.bind(this, true, {});
        return deepExtend.apply(this, arguments);
    },
    getMaxZIndex: function () {
        return Math.max.apply(null,
            $.map($('body *'), function (e) {
                if ($(e).css('position') != 'static')
                    return parseInt($(e).css('z-index')) || 1;
            }));
    },
    isNumeric: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    sanitizeText: function (input) {
        var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
            replace(/<[\/\!]*?[^<>]*?>/gi, '').
            replace(/<style[^>]*?>.*?<\/style>/gi, '').
            replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
        return output;
    }
};

