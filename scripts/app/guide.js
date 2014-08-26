/**
 * Guided Calculator
 */

;(function(SmartForm){

    var Guide = function(form){

        var self = this

        this.form = form;
        
        /* Add Guided class to the form */

        form.$el.addClass('smartform-guided')

        /* Options */

        this.options = form.options.guidedClass

        /* Questions */

        //this.form.$questions = this.form.$questions;

        /* Total question */

        this.totalQuestions = this.form.$questions.length

        /* Current question */

        this.currentQuestion = 0;


        /* Add Continue button */
            
        this.$continueBtn = $('<button />', {
            'class' : 'btn btn--primary smartform-guided-btn',
            'text'  : 'Continue',
            'type'  : 'button'
        })

        /* Submit button */

        this.$submitBtn = form.$el.find('.'+this.options.submitClass)

        /* Result section */

        this.$results = form.$el.find('.'+form.options.resultClass);

        /* Hide All questions except first */

        this.form.$questions
            .hide()
            .eq(0)
            .show()
            .addClass(this.options.activeClass)


        /* Add continue button */

        form.$el.append(self.$continueBtn)

        /* Current active question */

        this.$currentActive = this.form.$questions.eq(0);

        /* Add all bindings */

        this.bindings();

        /* Trigger */
        
        form.$el.trigger('smartform.guidedChange', this.currentQuestion);

        /* Continue */

        form.$el.on('click', '.'+ this.options.continueBtnClass, $.proxy(this.next, this));

        /* Keydown enter */

        form.$el.on('keydown.smartform', ':input', function(e){
            if(e.which == 13 && e.target.nodeName.toLowerCase() != "textarea" && ((self.currentQuestion + 1) < self.totalQuestions)) {
                self.next()
                
                e.preventDefault();
            }
        })

        /**
         * Edit button click         
         */
        form.$el.on('click', '[data-edit-item]', function(event){

            self.edit($(this).data('edit-item'))

            event && event.preventDefault();
        })

        /* End form */

        form.$el.on('smartform.guidedEnd', function(){

            self.end()
        })

        return this

    }

    /**
     * Prototype
     */

    Guide.prototype = {

        init: function(){

            

            return this;
            
        },

        bindings: function(){

            
            this.form.$el.on('smartform.guidedChange', $.proxy(this.change, this));

        },

        change: function(){

            /* Refresh questions */

            this.refresh();
            
            
            var self = this,
                i = self.currentQuestion

            this.totalQuestions = this.form.$questions.length
                    

            /* Add active class */

            
            $(self.form.$questions)
                .removeClass(self.options.activeClass)
                .eq(i)
                .addClass(self.options.activeClass)
                .show()
                .find(':input')
                .eq(0)
                .focus()

            /* Toggle Continue button */

            self.$continueBtn.toggle(((self.currentQuestion + 1) < self.totalQuestions) || self.totalQuestions == 1)

            /* Toggle submit button */

            self.$submitBtn.toggle(((self.currentQuestion + 1) >= self.totalQuestions) && self.totalQuestions != 1)
            
            
            /* Update answers */

            self.update();

        },

        next: function(){

            var self = this;

            /* Check if the answer has been answered: Validate */
            
            if(!self.form.API().validate()) return ;
            
            /* Check if should Exit the form */

            if(self.form._form.hasOwnProperty('exitOn') && self.form.options.methods.hasOwnProperty(self.form._form.exitOn)){

                var exitFn = self.form.options.methods[self.form._form.exitOn].call(self.form),
                    exitBoolean = (typeof exitFn ==  "object")? exitFn.notEligible : exitFn
                
                if(exitBoolean){
        
                    self.form.API().evaluate()

                    /* Trigger question change */

                    self.form.$el.trigger('smartform.guidedEnd', self.form.$el)

                    return ;
                }
            }

            /* Trigger question change */

            self.form.$el.trigger('smartform.guidedChange', ++self.currentQuestion)

        },

        edit: function(index){
            
            /* Hide results */            

            this.$results.hide();

            /* Updated current question index */
            
            this.currentQuestion = index - 1;
            
            /* Add active classes */

            $(this.form.$questions)
                .removeClass(this.options.activeClass)
                .slice(this.currentQuestion+1, this.totalQuestions)
                .hide()
                .end()
                .eq(this.currentQuestion)
                .addClass(this.options.activeClass)
                .show();

            
            /* Trigger edit mode */

            this.form.$el.trigger('smartform.editMode');

            /* Trigger Change */

            this.form.$el.trigger('smartform.guidedChange', this.currentQuestion);

        },

        refresh: function(){

            this.form.$questions = $.grep(this.form.$allquestions, function(item){
                
                return !$(item).hasClass('smartform-inactive')
                
            })

            //this.form.total


            /* Update Index */

            $.each(this.form.$questions, function(i, q){

                $(q).
                    find('.smartform__number').text(i+1)
                    .end()
                    .find('.js-edit-link')
                    .data('edit-item', i+1)

            })

        },
        
        update: function(){

            var $q = $(this.form.$questions).eq(this.currentQuestion - 1),
                question = $q.data('question')
            
            $q
                .find('.question__answer')
                .html(this.form.API().get(question, true))

        },

        end: function(){

            /* Hide continue button */

            this.$continueBtn.hide();

            /* Hide submit button */

            this.$submitBtn.hide();

            /* Move to the next question */

            ++ this.currentQuestion;

            /* Remove active class from all questions */

            $(this.form.$questions).removeClass(this.options.activeClass)

            /* Update the answer of last question */

            this.update()

        }
    }

    /* Exports */
    
    SmartForm.Guide = Guide

})(SmartForm);