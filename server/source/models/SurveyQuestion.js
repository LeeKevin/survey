'use strict';

var Sequelize = require('sequelize');

var schema = {
    question: {
        type: Sequelize.STRING,
        allowNull: false
    },
    archived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
};

var classMethods = {
    associate: function (models) {
        this.hasMany(models.QuestionItem);
    },
};

var instanceMethods = {};

var hooks = {};

module.exports = function (sequelize) {
    var SurveyQuestion = sequelize.define("SurveyQuestion", schema, {
        classMethods: classMethods,
        instanceMethods: instanceMethods,
        hooks: hooks
    });

    return SurveyQuestion;
};
