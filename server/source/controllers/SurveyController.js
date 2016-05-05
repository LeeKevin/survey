(function () {
    'use strict';

    var SurveyRepository = require('../repositories/SurveyRepository');

    var SurveyController = {
        random: function (req, res, next) {
            SurveyRepository.retrieveRandomSurveyQuestion(req.query.user_id, function (err, values) {
                if (err) return next(err);

                res.status(200).json(values);
            });
        },
        answer: function (req, res, id, next) {
            SurveyRepository.answer(req.body.user_id, req.body.option_id, function (err) {
                if (err) return next(err);

                res.status(200).json({
                    'message': 'Question answered!'
                });
            });
        },
        all: function (req, res, next) {
            SurveyRepository.all(req.query, function (err, questions) {
                if (err) return next(err);

                res.status(200).json(questions);
            });
        },
        update: function (req, res, next) {
            var action_type, parameters = {
                question: req.body.question,
                archived: req.body.archived
            };

            action_type = 'created';
            if (req.params.id) {
                parameters.id = req.params.id;
                action_type = 'updated';
            }
            if (req.body.QuestionItems) {
                parameters.QuestionItems = req.body.QuestionItems;
            }

            SurveyRepository.save(parameters, function (err, question) {
                if (err) return next(err);

                res.status(200).json({
                    message: "Question " + action_type + '!',
                    question_id: question.id
                });
            });
        }
    };

    module.exports = SurveyController;
})();
