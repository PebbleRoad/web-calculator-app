/**
 * Load configuration file
 */

require([    
    'app/app',
    'moment',
    'mathjs'
], 

function(app, moment, mathjs){

    $('.calculator').smartform({
        schema: 'scripts/app/schema/schema.json',
        methods: {
            submitHandler: function(){
                this.API().evaluate()
            },
            fnAge: function(){

                var dob = this.API().get('dob')

                return moment(dob, 'DD MMMM YYYY').fromNow()
            }
        }
    })

});