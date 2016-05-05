'use strict';

var User = require('../source/models').User;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return User.bulkCreate([{
            username: 'admin',
            password: 'kevinisawesome',
        }], {
            individualHooks: true
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
