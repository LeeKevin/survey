'use strict';

var Sequelize = require('sequelize');

var schema = {};

var classMethods = {
    associate: function (models) {
        this.hasMany(models.SurveyAnswer);
    },
};

var instanceMethods = {};

var hooks = {};

module.exports = function (sequelize) {
    var SurveyUser = sequelize.define("SurveyUser", schema, {
        classMethods: classMethods,
        instanceMethods: instanceMethods,
        hooks: hooks
    });

    return SurveyUser;
};
