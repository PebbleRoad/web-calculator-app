QUnit.stop()

$.when(
    $.getJSON('../qunit/test-cases/Emi.json'),
    $.getJSON('../scripts/app/schema/schema.json')
)
    .then(function(p, schema){
        
        var module = p[0],
            real_schema = schema[0]
        
        var methods= {
            submitHandler: function(){
                
                this.API().evaluate()

            },
            fnCalculate: function(){

                var amount = this.API().get('amount'),
                    year = this.API().get('term'),
                    term = year * 12,
                    rate = this.API().get('rate')/12/100
                    
                /* Calculate EMI */

                var emi = amount * rate * mathjs.pow(1+rate, term)/(mathjs.pow(1+rate, term) -1)

                

                /* Return the values to the template */

                return {
                    emi            : mathjs.round(emi, 0),
                    total_payment  : mathjs.round(emi * term, 0),
                    total_interest : mathjs.round(emi * term, 0) - amount                    
                }
                
                
            }
        }


        SpecBuilder.call(this, module, real_schema, methods)


    }
);