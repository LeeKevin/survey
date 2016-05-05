'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Util = require('../lib/util'),
    Dispatcher = require('../lib/dispatcher'),
    Session = require('../lib/session');

module.exports = Backbone.View.extend({
    events: {
        "click .question": "toggleQuestionDetails",
        "click .survey-header": "toggleQuestionSection",
        "click .question-edit": "edit",
        "click .question-archive": "archive"
    },
    initialize: function (options) {
        Dispatcher.on('CloseDashboard', this.close, this);
        this.status = typeof options.active == 'undefined' ? 'All' : (options.active ? 'Active' : 'Archived');

        this.refreshCollection();
    },
    render: function () {
        $(this.el).html(Util.renderPartial('questions-list', {
            status: this.status,
            count: this.collection ? this.collection.length : 0,
            minimized: this.status == 'Archived',
            questions: this.collection.toJSON()
        }));
        return this;
    },
    toggleQuestionDetails: function (event) {
        if (event && event.target !== event.currentTarget) {
            return;
        }

        var row = $(event.currentTarget);
        if (row.hasClass('selected')) {
            row.removeClass('selected');
        } else {
            row.addClass('selected');
        }
    },
    toggleQuestionSection: function (event) {
        var row = $(event.currentTarget);
        if (row.hasClass('minimized')) {
            row.removeClass('minimized');
        } else {
            row.addClass('minimized');
        }
    },
    edit: function (event) {
        var question_id = $(event.currentTarget).closest('.question').attr('data-id');
        var question = this.collection.get(question_id);

        Dispatcher.trigger('CloseDashboard');
        this.goTo('edit-question', {question: question});
    },
    archive: function (event) {
        var question_id = $(event.currentTarget).closest('.question').attr('data-id');
        var question = this.collection.get(question_id);

        question.save({archived: 1}, {
            headers: {Authorization: 'Bearer ' + Session.getAdminToken()},
            success: (function () {
                this.refreshCollection();
            }).bind(this),
            error: function (res) {
                console.error(res, "Error fetching survey questions from the server.");
            }
        });
    },
    refreshCollection: function (next) {
        this.collection.fetch({
            success: (function () {
                this.render();
                if (typeof next == 'function') next();
            }).bind(this)
        });
    },
    close: function () {
        Dispatcher.off('CloseDashboard', this.close, this);
        this.undelegateEvents();
    }
});