'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Util = require('../lib/util'),
    Dispatcher = require('../lib/dispatcher'),
    QuestionsListView = require('../views/QuestionsListView'),
    SurveyCollection = require('../collections/SurveyCollection');

module.exports = Backbone.View.extend({
    events: {
        "click .logout": "logout",
        "click .survey-admin-back": "backToDashboard",
        "click .create-question": "createQuestion"
    },
    initialize: function (options) {
        Dispatcher.on('CloseDashboard', this.close, this);
        $(this.el).html(Util.renderPartial('dashboard', {asTemplate: options.asTemplate})).attr('data-context', 'admin-login');
        if (options.asTemplate) return;

        var activeQuestions = new SurveyCollection(null, {active: 1}),
            archivedQuestions = new SurveyCollection(null, {active: 0});

        this.archivedQuestionsView = new QuestionsListView({
            active: 0,
            el: $(this.el).find('#archived-questions-container')[0],
            collection: archivedQuestions
        });

        this.activeQuestionsView = new QuestionsListView({
            active: 1,
            el: $(this.el).find('#active-questions-container')[0],
            collection: activeQuestions
        });

        //re-sync and render the archived questions whenever the active questions are refreshed.
        activeQuestions.on('sync', (function () {
            archivedQuestions.fetch({
                success: (function () {
                    this.archivedQuestionsView.render();
                }).bind(this)
            });
        }).bind(this));

    },
    render: function () {
        return this;
    },
    logout: function () {
        Dispatcher.trigger('CloseDashboard');
        this.goTo('admin-logout');
    },
    backToDashboard: function () {
        Dispatcher.trigger('CloseDashboard');
        this.goTo('admin-dashboard');
    },
    createQuestion: function () {
        Dispatcher.trigger('CloseDashboard');
        this.goTo('create-question');
    },
    close: function () {
        Dispatcher.off('CloseDashboard', this.close, this);
        this.undelegateEvents();
    }
});