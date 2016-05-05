'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Util = require('../lib/util'),
    Session = require('../lib/session');

module.exports = Backbone.View.extend({
    events: {
        "click .modal-overlay": "close",
        "click .modal-close": "close",
    },
    initialize: function (options) {
        if (!options.viewClass) return;

        $(this.el).html(Util.renderPartial('modal')).find('.modal-overlay').css('z-index', Util.getMaxZIndex());
        this.replaceView(options.viewClass, options.viewOptions);
    },
    render: function () {
        this.modalView.render();
        return this;
    },
    replaceView: function (viewClass, viewOptions) {
        if (!viewClass) return;

        this.viewClass = viewClass;
        this.viewOptions = viewOptions;
        this.viewOptions.el = $(this.el).find('.modal-content');
        this.modalView = new this.viewClass(this.viewOptions);

        this.render();
    },
    close: function (event) {
        if (event && event.target !== event.currentTarget) {
            return;
        }

        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();

        $(this.el).empty();
        this.closed = true;
    }
});