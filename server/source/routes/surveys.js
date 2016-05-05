'use strict';

var Route = require('express').Router(),
    SurveyController = require('../controllers/SurveyController'),
    VerifyToken = require('../middleware/VerifyToken')
    ;

module.exports = function (app) {

    Route.get('/random', SurveyController.random);
    Route.post('/:id/answer', function (req, res, next) {
        var id = req.params.id;
        SurveyController.answer(req, res, id, next);
    });

    Route.use(VerifyToken);
    Route.get('/', SurveyController.all);
    Route.post('/', SurveyController.update);
    Route.put('/:id', SurveyController.update);

    app.use('/api/surveys', Route);
};
