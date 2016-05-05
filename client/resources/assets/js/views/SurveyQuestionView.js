'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Util = require('../lib/util'),
    Session = require('../lib/session');

module.exports = Backbone.View.extend({
    events: {
        "click .question-item": "selectQuestion",
        "click .question-submit": "submitQuestion"
    },
    initialize: function () {
        this.template = function (params) {
            return Util.renderPartial('question', params);
        };
    },
    render: function () {
        $(this.el).html(this.template(this.model.attributes)).attr('data-context', 'survey-question');
        return this;
    },
    selectQuestion: function (event) {
        var element = $(event.currentTarget);
        if (element.hasClass('selected')) {
            element.removeClass('selected');
        } else {
            element.addClass('selected');
        }

        element.siblings('.question-item').removeClass('selected');
        element.closest('.question-items').siblings('.error').remove();
    },
    submitQuestion: function (event) {
        var button = $(event.currentTarget);
        var selectedItem = button.siblings('.question-items').find('.question-item.selected');

        if (selectedItem.length == 0 && !button.next('.error').length) {
            button.after('<span class="error">Oops! Please select an answer!</span>');
            return;
        }

        //Send answer back to server to persist.
        $(this.el).addClass('survey-loading');
        this.model.answer(selectedItem.attr('data-id'), (function () {
            $(this.el).removeClass('survey-loading').html(Util.renderPartial('thanks'));
        }).bind(this));
    }
});