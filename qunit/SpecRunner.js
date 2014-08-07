/**
 * Config
 */

require.config({

    baseUrl: '../scripts',

    paths: {
        jquery      : '../bower_components/jquery/dist/jquery.min',        
        hbs         : '../bower_components/handlebars/handlebars',        
        underscore  : '../bower_components/underscore/underscore',
        moment      : '../bower_components/momentjs/min/moment.min',
        mathjs      : '../bower_components/mathjs/dist/math.min',
        validate    : '../bower_components/jquery-validation/dist/jquery.validate',
        qunit       : '../qunit/lib/qunit/qunit.min',        
        specbuilder : '../qunit/Specbuilder'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        hbs: {
          exports: 'Handlebars'
        },
        qunit: {
           exports: 'QUnit',
           init: function() {
               QUnit.config.autoload = false;
               QUnit.config.autostart = false;               
           },
           deps: ['jquery']
       },
       specbuilder: {
          deps: ['qunit']
       }
    },

    hbs: { // optional
        helpers: true,            // default: true
        i18n: false,              // default: false
        templateExtension: 'hbs', // default: 'hbs'
        partialsUrl: ''           // default: ''
    },

    deps: ['main']

})


var specs = [
    '../qunit/spec/Calculator',    
    '../qunit/spec/Emi'
  ];

require(['main', 'moment', 'specbuilder'], function(){

    require(specs, function () {

        
          QUnit.load();
          QUnit.start();
        

    });
})