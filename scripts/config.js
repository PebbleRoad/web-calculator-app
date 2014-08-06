/**
 * Config
 */

require.config({


    paths: {
        jquery     : '../bower_components/jquery/dist/jquery.min',        
        hbs: '../bower_components/handlebars/handlebars',        
        underscore: '../bower_components/underscore/underscore',
        moment: '../bower_components/momentjs/min/moment.min',
        mathjs: '../bower_components/mathjs/dist/math.min',
        validate: '../bower_components/jquery-validation/dist/jquery.validate',
        rivets: '../bower_components/rivets/dist/rivets.min.js'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        hbs: {
            exports: 'Handlebars'
        }
    },

    

    deps: ['main']

})