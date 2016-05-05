'use strict';

var Sequelize = require('sequelize');

var schema = {
    option: {
        type: Sequelize.STRING,
        allowNull: false
    }
};

var classMethods = {
    associate: function (models) {
        this.belongsTo(models.SurveyQuestion);
        this.hasMany(models.SurveyAnswer);
    },
};

var instanceMethods = {};

var hooks = {};

module.exports = function (sequelize) {
    var QuestionItem = sequelize.define("QuestionItem", schema, {
        classMethods: classMethods,
        instanceMethods: instanceMethods,
        hooks: hooks
    });

    return QuestionItem;
};
