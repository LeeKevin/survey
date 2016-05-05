'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    AdminDashboardView = require('../views/AdminDashboardView'),
    Util = require('../lib/util'),
    Dispatcher = require('../lib/dispatcher'),
    Session = require('../lib/session'),
    SurveyQuestion = require('../models/SurveyQuestion');

require('jquery-validation');

module.exports = Backbone.View.extend({
    events: {
        "click .add-question-item": "addQuestionItem",
        "click .remove-question-item": "removeQuestionItem",
        "submit .edit-question-form": "saveQuestion"
    },
    initialize: function (options) {
        Dispatcher.on('CloseDashboard', this.close, this);
        this.question = options.question ? options.question : new SurveyQuestion();
        Util.registerPartial('question-item-editable');
    },
    render: function () {
        this.dashboardView = new AdminDashboardView({
            el: this.el,
            asTemplate: true
        });
        $(this.el).find('.survey-admin-dashboard-area').html(Util.renderPartial('edit-question', this.question.attributes));

        $(this.el).find('.edit-question-form').validate({
            onfocusout: false,
            onkeyup: false,
            rules: {
                question: {
                    required: {
                        depends: function () {
                            $(this).val($.trim($(this).val()));
                            return true;
                        }
                    }
                }
            },
            messages: {
                question: {
                    required: "Oops! Please enter a question."
                }
            },
            errorPlacement: function (error, element) {
                element.focus();
                $('#edit-question-error').html(error.html());
            },
            errorContainer: '#edit-question-error'
        });
        return this;
    },
    addQuestionItem: function (event) {
        var newItem, itemsList = $(this.el).find('.question-items-list');
        $('#edit-question-error').hide();

        if (itemsList.find('input:last').val() == "") {
            return itemsList.find('input:last').focus();
        }

        newItem = $(Util.renderPartial('question-item-editable'));
        itemsList.append(newItem);
        newItem.find('input').focus();
    },
    removeQuestionItem: function (event) {
        $(event.currentTarget).closest('.question-item-container').remove();
    },
    saveQuestion: function (event) {
        event.preventDefault();

        var form = $(event.currentTarget);
        if (form.valid()) {
            var options = form.find('.question-items-list').find('.question-item').filter(function () {
                return Util.trim(this.value) != "";
            });
            if (options.length <= 1) {
                return $('#edit-question-error').html('Oops! Please add at least two question options.').show();
            }

            //Parse options into objects
            var optionsData = [];
            options.each(function (i, option) {
                var optionData = {
                    option: Util.trim(option.value)
                };
                if (option.hasAttribute('data-id') && $(option).attr('data-id') != "") optionData.id = $(option).attr('data-id');
                optionsData.push(optionData);
            });

            this.question.save({
                question: Util.trim(form.find('input[name=question]').val()),
                QuestionItems: optionsData
            }, {
                headers: {Authorization: 'Bearer ' + Session.getAdminToken()},
                success: (function () {
                    Dispatcher.trigger('CloseDashboard');
                    this.dashboardView.backToDashboard();
                }).bind(this),
                error: function (res) {
                    console.error(res, "Error saving survey question.");
                }
            });
        }
    },
    close: function () {
        Dispatcher.off('CloseDashboard', this.close, this);
        this.undelegateEvents();
    }
});