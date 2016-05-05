'use strict';

var models = require('../models'),
    SurveyUser = models.SurveyUser,
    SurveyQuestion = models.SurveyQuestion,
    QuestionItem = models.QuestionItem,
    SurveyAnswer = models.SurveyAnswer,
    Promise = require('bluebird'),
    GenericError = require('../errors/GenericError'),
    Util = require('../util/util');

module.exports = {
    retrieveRandomSurveyQuestion: function (user_id, next) {
        var _this = this;
        SurveyUser.findById(user_id).then(function (user) {
            return models.sequelize.query("SELECT sq.id FROM SurveyQuestions as sq " +
            "WHERE sq.id > (SELECT FLOOR( MAX(id) * RAND()) FROM SurveyQuestions) AND sq.archived = 0 " +
            (
                user ?
                " AND sq.id NOT IN ( " +
                "    SELECT qi.surveyQuestionId " +
                "FROM survey.QuestionItems qi " +
                "INNER JOIN survey.SurveyAnswers sa ON sa.questionItemId = qi.id " +
                "INNER JOIN survey.SurveyUsers su ON su.id = sa.surveyUserId AND su.id = " + user.id +
                ") "
                    : ""
            ) +
            "ORDER BY sq.id ASC " +
            "LIMIT 1;", {type: models.sequelize.QueryTypes.SELECT}).then(function (id) {
                _this.retrieveItemsForQuestion(id, function (err, question) {
                    if (err) return next(err);
                    if (user) return next(null, {question: question});

                    //create new survey user
                    SurveyUser.create({}).then(function (survey_user) {
                        return next(null, {
                            question: question,
                            user_id: survey_user.id
                        });
                    }).catch(next);
                });
            }).catch(next);
        }).catch(next);
    },
    retrieveItemsForQuestion: function (question_id, next) {
        if (Util.isArray(question_id)) {
            if (question_id.length > 0) question_id = question_id[0].id;
            else return next();
        }
        if (!question_id) return next();

        SurveyQuestion.findById(question_id, {
            include: [{
                model: QuestionItem,
                order: 'id ASC'
            }]
        }).then(function (question) {
            next(null, question);
        }).catch(next);
    },
    answer: function (user_id, option_id, next) {
        if (!user_id) return next(new GenericError('User Id Missing', 400));
        if (!option_id) return next(new GenericError('Question Item Id Missing', 400));
        var answer = SurveyAnswer.build({});

        answer.setSurveyUser(user_id, {save: false});
        answer.setQuestionItem(option_id, {save: false});
        answer.save().then(function () {
            next();
        }).catch(next);
    },
    all: function (options, next) {
        var query = {
            attributes: ['id', 'question', 'archived', ["(SELECT(COUNT(sa.id)) FROM survey.QuestionItems qi INNER JOIN survey.SurveyAnswers sa ON sa.questionItemId = qi.id WHERE qi.surveyQuestionId = `SurveyQuestion`.`id`)", 'AnswerTotal']],
            include: [
                {
                    model: QuestionItem,
                    attributes: ['id', 'option', [models.sequelize.fn('COUNT', models.sequelize.col('QuestionItems.SurveyAnswers.QuestionItemId')), 'AnswerCount']],
                    include: [{
                        model: SurveyAnswer,
                        attributes: ['id'],
                    }],
                    order: 'id ASC'
                },
            ],
            group: ['SurveyQuestion.id', 'QuestionItems.id', 'QuestionItems.SurveyAnswers.QuestionItemId'],
        };
        var where = {};
        if (typeof options.active != 'undefined') where.archived = options.active == "0" || options.active == "false";
        if (Object.keys(where).length) query.where = where;

        SurveyQuestion.findAll(query).then(function (questions) {
            next(null, questions);
        }).catch(next);
    },
    save: function (parameters, next) {
        if (parameters.id) {
            var newItemIds = [];
            //update
            return SurveyQuestion.findById(parameters.id, {
                include: [{
                    model: QuestionItem,
                    order: 'id ASC'
                }]
            }).then(function (question) {
                if (parameters.question) question.question = parameters.question;
                if (typeof parameters.archived != 'undefined') question.archived = parameters.archived;

                return question.save();
            }).then(function (question) {
                if (parameters.QuestionItems && (parameters.archived != true)) {
                    return Promise.each(parameters.QuestionItems, function (item) {
                        if (item.id) {
                            newItemIds.push(item.id);
                            return QuestionItem.update({
                                option: item.option
                            }, {where: {id: item.id}});
                        } else {
                            return question.createQuestionItem({
                                option: item.option
                            });
                        }
                    }).then(function () {
                        return Promise.resolve(question);
                    });
                } else {
                    return Promise.resolve(question);
                }
            }).then(function (question) {
                if (newItemIds.length > 0) {
                    return Promise.each(question.QuestionItems, function (item) {
                        if ($.inArray(item.id, newItemIds) == -1) {
                            return QuestionItem.findById(item.id).then(function (questionItem) {
                                return questionItem.destroy();
                            });
                        }
                    }).then(function () {
                        return Promise.resolve(question);
                    });
                } else {
                    return Promise.resolve(question);
                }
            }).then(function (question) {
                next(null, question);
            }).catch(next);
        } else {
            //create
            SurveyQuestion.create(parameters, {
                include: [QuestionItem]
            }).then(function (question) {
                next(null, question);
            }).catch(next);
        }
    }
};