'use strict';

var models = require('../source/models'),
    SurveyQuestion = models.SurveyQuestion,
    QuestionItem = models.QuestionItem;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return SurveyQuestion.create({
            question: 'How awesome is Kevin Lee?',
            QuestionItems: [{
                id: 1,
                option: 'Very',
            }, {
                id: 2,
                option: 'Extremely',
            }, {
                id: 3,
                option: 'Mind-bogglingly',
            }]
        }, {
            include: [QuestionItem]
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('SurveyQuestions', null, {});
    }
};
