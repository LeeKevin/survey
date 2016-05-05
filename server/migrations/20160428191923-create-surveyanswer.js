'use strict';
module.exports = {
    up: function (queryInterface, Sequelize, next) {
        queryInterface.createTable('SurveyAnswers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            surveyUserId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'SurveyUsers',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            questionItemId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'QuestionItems',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }).then(function () {
            queryInterface.sequelize.query('CREATE UNIQUE INDEX uniqueUserQuestion ON SurveyAnswers(surveyUserId, questionItemId)').then(function () {
                next();
            });
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('SurveyAnswers');
    }
};