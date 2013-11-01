requirejs.config({
    paths: {
        'modernizr': '../vendor/modernizr',
        'text': '../vendor/requirejs-text/text',
        'knockout': '../vendor/knockout.js/knockout',
        'jquery': '../vendor/jquery/jquery',
        'bootstrap': '../vendor/bootstrap/bootstrap',
        'bootstraplib': '../vendor/bootstrap',
        'durandal':'../vendor/durandal',
        'plugins': '../vendor/durandal/plugins',
        'transitions': '../vendor/durandal/transitions',
        'touchscroll': '../vendor/touchscroll'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    }
});

define(function(require) {
    var modernizr = require('modernizr/modernizr'),
        app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator'),
        system = require('durandal/system');

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Moped - Web Client for Mopidy music server';

    app.configurePlugins({
        router:true,
        widget: true,
        observable: true,
        dialog: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model.
        app.setRoot('viewmodels/shell');
    });
});