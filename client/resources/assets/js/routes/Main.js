(function () {
    'use strict';

    var Backbone = require('backbone'),
        $ = require('jquery'),
        Session = require('../lib/session'),
        AdminButtonView = require('../views/AdminButtonView'),
        AdminLoginView = require('../views/AdminLoginView'),
        AdminDashboardView = require('../views/AdminDashboardView'),
        ModalView = require('../views/ModalView'),
        EditQuestionView = require('../views/EditQuestionView'),
        SurveyQuestionView = require('../views/SurveyQuestionView'),
        SurveyQuestion = require('../models/SurveyQuestion');

    module.exports = Backbone.Router.extend({
        routes: {
            "admin-login": "adminLogin",
            "admin-dashboard": "adminDashboard",
            "admin-logout": "adminLogout",
            "edit-question": "editQuestion",
            "create-question": "createQuestion"
        },
        routeParams: {},
        currentRoute: '',
        navigate: function (url, params) {
            //set params
            this.param(url, params);

            // Override pushstate and load url directly
            this.currentRoute = url;
            Backbone.history.loadUrl(url);
        },
        param: function (fragment, params) {
            var matchedRoute;
            $.each(Backbone.history.handlers, function (i, handler) {
                if (handler.route.test(fragment)) {
                    matchedRoute = handler.route;
                }
            });
            if (typeof params !== 'undefined') {
                this.routeParams[fragment] = params;
            }
            if (typeof fragment == 'undefined' && this.currentRoute) {
                return this.routeParams[this.currentRoute ];
            }
            return this.routeParams[fragment];
        },
        initialize: function () {
            //Extend Backbone View class to allow easy routing
            Backbone.View.prototype.goTo = (function (loc, params) {
                this.navigate(loc, params);
            }).bind(this);

            var container = $('<div id="survey-container" class="survey-app"></div>').appendTo(document.body);
            this.container = container;

            //set up Admin button
            new AdminButtonView({
                el: $('<a class="survey__admin-button"></a>').appendTo(document.body)[0]
            });

            //initialize survey popup
            Session.getUser((function (user_id) {
                //Skip survey display if admin login is already open.
                if (this.container.find('[data-context=admin-login]').length) return;
                SurveyQuestion.fetchRandom(user_id, (function (question) {
                    if (!question) return;
                    new ModalView({
                        el: container[0],
                        viewClass: SurveyQuestionView,
                        viewOptions: {
                            model: question
                        }
                    });
                }).bind(this));
            }).bind(this));
        },
        adminLogin: function () {
            //Skip render if admin login is already open.
            if (this.container.find('[data-context=admin-login]').length) return;

            if (Session.getAdminToken()) {
                return this.adminDashboard();
            }

            this.modalView = new ModalView({
                el: this.container[0],
                viewClass: AdminLoginView,
                viewOptions: {}
            });
        },
        adminLogout: function () {
            Session.removeAdminToken();
            this.modalView.close();
        },
        adminDashboard: function () {
            Session.checkToken((function (result) {
                if (result) {
                    if (this.modalView && !this.modalView.closed) {
                        this.modalView.replaceView(AdminDashboardView, {});
                    } else {
                        this.modalView = new ModalView({
                            el: this.container[0],
                            viewClass: AdminDashboardView,
                            viewOptions: {}
                        });
                    }
                } else {
                    Session.removeAdminToken();
                    return this.adminLogin();
                }
            }).bind(this));
        },
        editQuestion: function () {
            var params = this.param('edit-question');
            Session.checkToken((function (result) {
                if (result && this.modalView && !this.modalView.closed) {
                    this.modalView.replaceView(EditQuestionView, {
                        question: params.question
                    });
                } else {
                    Session.removeAdminToken();
                    return this.adminLogin();
                }
            }).bind(this));
        },
        createQuestion: function () {
            Session.checkToken((function (result) {
                if (result && this.modalView && !this.modalView.closed) {
                    this.modalView.replaceView(EditQuestionView, {});
                } else {
                    Session.removeAdminToken();
                    return this.adminLogin();
                }
            }).bind(this));
        }
    });
})();