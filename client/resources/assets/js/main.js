(function () {
    'use strict';

    var $ = require('jquery');

    $(document).ready(function () {
        //Load survey app after iframe loaded
        $("iframe").load(function () {
            require("./app");
        });

        //Set iframe source
        $("iframe").attr({
            src: "http://www.appsumo.com/"
        });

    });
})();