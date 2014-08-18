(function(){

    /**
     * For unit test logging
     */
    init()

    function init() {
        

        QUnit.testStart = function(name) {
            console.group("Test: " + name.name);
        };

        QUnit.testDone = function(details) {
            console.info("Test: %d failures / %d tests", details.failed, details.total);
            console.groupEnd();
        };

        QUnit.moduleStart = function(name) {
            console.group("Module: " + name.name);
        };

        QUnit.moduleDone = function(details) {
            console.info("Module: %d failures / %d tests", details.failed, details.total);
            console.groupEnd();
        };

        QUnit.begin = function() {
            console.log("=== Running Test Suite ===");
        };

        
        QUnit.reset = function() {
            console.log("Test done!");
        };
    }

	/**
	 * Date match
	 */
	
	var dateRegex;

	/**
	 * Function
	 */
	
	function nlp(val){

		switch(typeof val){

			case "number":
				return val
				break;

			case "string":
				return val
				break;
				
		}
	}


	/**
	 * Spec builder
	 */

	window.SpecBuilder = function(module, real_schema, methods){

        QUnit.stop()

        var self = this;

        this.fixture = $('<div class="calculator" />');

        this.fixture.on('smartform.loaded', function(){
            
            QUnit.start()
            
        })

        this.calculator = this.fixture.smartform({
            schema: real_schema,
            guided: false,
            methods: methods
                                   
        }).data('smartform')
        
        QUnit.module(module.name);

		QUnit.test('Calculations', function(assert){
            
            QUnit.stop()

            var default_assert = 'equal';
            
            for(var i = 0; i < module.tests.length; i ++){

                var data = module.tests[i].data,
                    test_name = module.tests[i].name,
                    expected = module.tests[i].expected,
                    normalized = '',
                    method;
                
                for (var d in data){

                	/* Date Recognition */

                	normalized = nlp(data[d])
                    
                    /* Set data in API */

                    self.calculator.API().set(d, normalized);
                    
                    /* Add input values to test name */

                    test_name+= ', ' + d +': '+ data[d] + ' ';

                }

                for(var e in expected){

                    /* Assert equal */

                    if(assert.hasOwnProperty(default_assert)){

                        /* Check if the method has a variable */

                        var split_method = e.split('.');

                        if(self.calculator._calculations.hasOwnProperty(split_method[0])){
                            
                            var method_name = self.calculator._calculations[split_method[0]];
                            
                            if(split_method.length > 1){

                            	method = methods[method_name].call(self.calculator)[split_method[1]]

                            }else{

                            	method = methods[method_name].call(self.calculator)
                            }

                        }                        
                        
                        /* Add output to test name */

						test_name+=', ' + e + ': ' + method + ' ';

                        /* Test */
                        
                        
                        assert[default_assert](method, expected[e],test_name)

                        QUnit.start()
                        
                        

                    }else{

                        throw new Error('Qunit assert method not found')
                    }
                }

            }            

        });

	}


})()