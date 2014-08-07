var 
f, 
c,
schema = {
        "schema": {        
            "amount": {
                "type": "string",
                "label": "What is your principal loan amount?",            
                "rules": {
                    "required": true
                },
                "messages": {
                    "required": "Loan amount is required."
                }
            },
            "rate": {
                "type": "string",
                "label": "Interest rate (%)",
                "rules": {
                    "required": true,
                    "number": true
                },
                "messages": {
                    "required": "Interest rate is required."
                }
            },
            "submit": {
                "type": "submit",
                "label": "Calculate"
            },
            "result": {
                "type": "result",
                "template": "scripts/app/results/result.hbs"
            }
        },
        "form": {
            "action": "/url/submit"        
        },
        "events": {        
            "submit": {
                "click": "submitHandler"
            }
        },
        "calculations": {
            "output": "fnCalculate"        
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


QUnit.test('API', function(){

    ok(c.API(), 'API is defined')

    ok(c.API().set('amount', 20000), 'API Method set')

    equal(c.API().get('amount'), 20000, 'API Method get')
})