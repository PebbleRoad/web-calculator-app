QUnit.stop()

$.when(
    $.getJSON('../qunit/test-cases/Age.json'),
    $.getJSON('../scripts/app/schema/schema.json')
)
    .then(function(p, schema){
        
        var module = p[0],
            real_schema = schema[0]
        
        var methods= {
            submitHandler: function(){
                this.API().evaluate()
            },
            fnAge: function(){

                var dob = this.API().get('dob')

                return moment(dob, 'DD MMMM YYYY').fromNow()
            }
        }


        SpecBuilder.call(this, module, real_schema, methods)


    }
);