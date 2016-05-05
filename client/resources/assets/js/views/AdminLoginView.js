'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Util = require('../lib/util'),
    Session = require('../lib/session');

require('jquery-validation');

module.exports = Backbone.View.extend({
    events: {
        "submit #admin-login-form": "submitLogin",
    },
    initialize: function () {
    },
    render: function () {
        $(this.el).html(Util.renderPartial('login')).attr('data-context', 'admin-login')
            .find('#admin-login-form').validate({
                rules: {
                    username: 'required',
                    password: 'required'
                },
                errorPlacement: function (error, element) {
                    element.focus();
                }
            });
        return this;
    },
    submitLogin: function (event) {
        event.preventDefault();

        var form = $(event.currentTarget);
        if (form.valid()) {
            var formData = {};
            $.each(form.serializeArray(), function (i, n) {
                formData[n.name] = n.value;
            });

            Session.login(formData, (function (result, status, error) {
                if (result) { //log user in
                    this.undelegateEvents();
                    this.goTo('admin-dashboard');
                } else { //Display error
                    var submitButton = form.find('[type=submit]'),
                        errorContainer = submitButton.next('.error');
                    if (errorContainer.length == 0) {
                        submitButton.after($('<span class="error">' + error + '</span>'));
                    } else {
                        errorContainer.text(error);
                    }
                }
            }).bind(this));
        }
    }
});