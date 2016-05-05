'use strict';

var Sequelize = require('sequelize');

var schema = {};

var classMethods = {
    associate: function (models) {
        this.belongsTo(models.QuestionItem);
        this.belongsTo(models.SurveyUser);
    },
};

var instanceMethods = {};

var hooks = {};

module.exports = function (sequelize) {
    var SurveyAnswer = sequelize.define("SurveyAnswer", schema, {
        classMethods: classMethods,
        instanceMethods: instanceMethods,
        hooks: hooks
    });

    return SurveyAnswer;
};
