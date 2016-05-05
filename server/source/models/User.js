'use strict';

/**
 * This is the default schema/model definition for a User.
 * Feel free to modify it!
 */

var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    Sequelize = require('sequelize');

var hashPassword = function (user, options, next) {
    // only hash the password if it has been modified (or is new)
    if (!user.changed('password') || user.dataValues.password.indexOf('$2a$') === 0) return next(null, user);

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            return next(null, user);
        });
    });
};

var schema = {
    username: {
        type: Sequelize.STRING,
        unique: true,
    },
    password: {
        type: Sequelize.STRING
    }
};

var classMethods = {
    associate: function (models) {
    },
};

var instanceMethods = {
    //Use to test passwords against the actual hashed password
    checkPassword: function (candidatePassword) {
        return bcrypt.compareSync(candidatePassword, this.password);
    },
};

var hooks = {
    beforeUpdate: hashPassword,
    beforeCreate: hashPassword
};

module.exports = function (sequelize) {
    var User = sequelize.define("User", schema, {
        classMethods: classMethods,
        instanceMethods: instanceMethods,
        hooks: hooks
    });

    return User;
};
