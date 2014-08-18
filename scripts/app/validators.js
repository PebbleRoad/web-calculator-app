;(function($){
    
    /**
     * Get full date
     * @param  {[type]} name
     * @param  {[type]} form
     * @return {[type]}     
     */
    function getDate(name, form){        
        return form.find('[name='+name+'-day]').val() + ' ' + form.find('[name='+name+'-month]').val() + ' ' + form.find('[name='+name+'-year]').val()
    }

    /**
     * Date must be {} months than current date
     */
    
    $.validator.addMethod('dateMoreThanEqualTo', function(value, element, param){

        switch(element.nodeName.toLowerCase()){

            case "select":
                var name = element.getAttribute('name').split('-')[0],
                    $currentform = $(this.currentForm)
                    fulldate = moment(getDate(name, $currentform), 'DD MMMM YYYY'),
                    checkAgainst = moment(param, 'DD MMMM YYYY');
                
                return fulldate.isAfter(checkAgainst) || fulldate.isSame(checkAgainst)

                break;
        }

    }, 'Date should be more than ${0}')


})(jQuery)