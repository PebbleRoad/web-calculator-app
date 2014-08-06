var 
f, 
c,
schema = {
    "schema": {
        "q1": {
            "type": "date",
            "label": "When does the EP expire?",
            "default": "1 August 2014",
            "rules": {
                "required": true
            },
            "messages": {
                "required": "Please enter a valid date."
            }
        },
        "submit": {
            "type": "submit",
            "label": "Calculate"
        },
        "result": {
            "type": "result",
            "template": "app/results/result-ep"
        }
        },
        "form": {
            "action": "/url/submit"
        },
        "events": {        
            "submit": {
                "click": "calculate"
            }
        },
        "calculations": {        
            "renewToday": "fnRenewToday",
            "epExpired": "fnExpired",
            "epExpiringToday": "fnExpiringToday",
            "success": "fnSuccess",
            "renewSuccessDate": "fnRenewSuccessDate"
        }
    },
    methods= {

    };


QUnit.module('Calculator', {

    setup: function(){

        f = $('<div class="c" />')

        c = f.smartform({
            schema: schema,
            methods: methods
        }).data('smartform')

    }
})

/**
 * Test initialization
 * @return {[type]} [description]
 */
QUnit.test('Initialization', function(){

    ok(f, 'Fixture is defined')

    ok($.fn.smartform, 'Smartform plugin is defined')

    ok(c, 'Calculator is defined')

})


QUnit.test('Calculations', function(){

    console.log(c.API())

    equal(1,1, 'a')

})