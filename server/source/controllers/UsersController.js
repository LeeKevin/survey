(function () {
    'use strict';

    var UsersController = {
        me: function (req, res, next) {
            res.status(200).json({
                'user_id': req.user.id,
                'username': req.user.username,
            });
        }
    };

    module.exports = UsersController;
})();
