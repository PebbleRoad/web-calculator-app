;(function($, Handlebars){

	/**
	 * Array.prototype.indexOf Shim
	 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
	 */
	if (!Array.prototype.indexOf) {
	  Array.prototype.indexOf = function (searchElement, fromIndex) {

	    var k;

	    if (this == null) {
	      throw new TypeError('"this" is null or not defined');
	    }

	    var O = Object(this);

	    var len = O.length >>> 0;

	    if (len === 0) {
	      return -1;
	    }

	    var n = +fromIndex || 0;

	    if (Math.abs(n) === Infinity) {
	      n = 0;
	    }

	    if (n >= len) {
	      return -1;
	    }

	    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

	    while (k < len) {
	      if (k in O && O[k] === searchElement) {
	        return k;
	      }
	      k++;
	    }
	    return -1;
	  };
	}

	/**
	 * Utility classes
	 */
	
	var utils = {};

	/**
	 * Contains
	 */
	
	utils._contains = function(obj, target){
		if (obj == null) return false;
	    if (Array.prototype.indexOf && obj.indexOf === Array.prototype.indexOf) return obj.indexOf(target) != -1;
	    return any(obj, function(value) {
	    	return value === target;
	    });
	}

	
	/**
	 * Default options
	 */
	
	var defaults = {
		resultClass: 'smartform-result',
		questionClass   : 'smartform-question',
		guidedClass: {            
			activeClass      : 'smartform-question-active',
			continueBtnClass : 'smartform-guided-btn',
			submitClass      : 'smartform-submit'
		}
	}

	/**
	 * Events
	 */
	
	var events = {
		loaded: 'smartform.loaded'
	}

	/**
	 * SmartForm constructor
	 * 
	 */

	function SmartForm(element, options){
		/* Reverse lookup */

		var self = this

		/* Version */

		this.__version__ = '0.0.1'

		/* Element */

		this.$el = $(element)

		/* Options */

		this.options = $.extend({}, this.$el.data(), defaults, options)        
		
		/* Get Schema */

		this.initialize()

		return this
		
	}

   

	/**
	 * Prototype methods
	 */

	SmartForm.prototype = {
		
		/**
		 * Initialize
		 */
		
		initialize: function(){

			var self = this
			
			/**
			 * If schema is an object
			 * @type {[object]}
			 */
			if(typeof this.options.schema == 'object'){

				afterLoaded(this.options.schema)

				return ;
			}

			/**
			 * If schema is a JSON file
			 * @type {[object]}
			 */

			$.ajax({
				
				dataType: 'json',
				
				mimeType: "application/json",

				url: this.options.schema,

				success: function(data){
								
					afterLoaded(data);
					
				},
				error: function(jqXHR, textStatus, errorThrown){
					throw new Error('JSON Parse error: '+ errorThrown)
				}

			});


			/* Guided or Flat */
					
			self.$el.on(events.loaded, function(){
				/**
				 * If there is no form tag present
				 * Add one
				 */

				if(
					!self.$el.find('form').length && 
					self.$el.prop("tagName") != "FORM"){

					self.$el.wrapInner('<form />');
				}

				/* Find all questions */

				self.$questions = self.$allquestions = self.$el.find('.'+self.options.questionClass)

					
				/* If guided */

				if(self.options.guided){

					var guide = new SmartForm.Guide(self).init()                    

				}
				

			})

			/**
			 * After Schema is loaded
			 */
			
			function afterLoaded(data){

				/* Schema to a function variable */

				self._schema = data.schema                

				/* Events to a function variable */

				self._events = data.events

				/* Form */

				self._form = data.form

				/* Calculations */

				self._calculations = data.calculations

				/* Build keys */

				self.buildKeys();

				/* Attach events */

				self.attachEvents();

				/* Build a form */

				self.parseSchema();                
				
			}

		},

		buildKeys: function(){

			this._flatSchema = this.flatten(this._schema)


			/* Keys */
			this._keys = []

			/* Question types */

			this._types = []

			/* Push */

			for(var key in this._flatSchema) {
				
				this._keys.push(key)

				this._types.push(this._flatSchema[key].fieldtype || this._flatSchema[key].type)
			}            

		},

		/**
		 * Parses a JSON object schma
		 */
		
		parseSchema: function(){

			var self = this,
				count = 0

			function traverse(o, obj){
				for(var property in o){

					if(o.hasOwnProperty(property)){                        

						if(
							o[property]!== null && 
							o[property].type === 'object'){
							
							traverse(o[property].properties, o[property])

							var objcount = 0;
							
						}
						else{
							
							/* Build the form */

							self.buildFields(property, o[property], ++count, obj)
							
						}

						/* Save the results */

						if(o[property].type === 'result') self._results = o[property]

					}
				}
			}

			/* Traverse the schema */

			traverse(this._schema)


			/* Trigger form completed */

			self.$el.trigger(events.loaded, self);

		},

		flatten: function(s){

			var _r = {};

			function recurse(s){

				for(var p in s){

					if(s[p].type == "object"){

						recurse(s[p].properties)

					}else{

						//(s[p].type != "submit") && (s[p].type != "result") && 
						_r[p] = s[p];
					}
				}
			}

			recurse(s)

			return _r;
			
		},

		
		/**
		 * Builds form objects
		 */
		
		buildFields: function(property, field, index, obj){

			
			var smartField = SmartForm.fieldtypes.transform(property, field, index, this.options, obj);


			/* Append the form */

			this.$el.append(smartField)

		},


		/**
		 * Attach events
		 */
		
		attachEvents: function(){

			var self = this,
				element,
				field_type,
				field_index;
			
			for(var e in this._events){

				field_index = self._keys.indexOf(e)
				field_type = self._types[field_index]                

				for(var event_name in this._events[e]){                    

					element = (e == '*')? ':input': (field_type == 'date')? '[name^="'+e+'-"]' : '[name="'+e+'"]';

					/**
					 * For events.loaded
					 */
					if(utils._contains(event_name.split(/\s/), events.loaded)){

						this.$el.on(events.loaded, {name: e}, function(event){
							self.fireEvent(event)
						})
					}

					/**
					 * For all other events
					 */

					this.$el.on(event_name, element, function(event){

						/* Call events from external Events API */
						
						self.fireEvent(event, this.name)

						
					})                    

				}

			}

		},

		fireEvent: function(event, element){    
			
			
			var full_event = event.type + (event.namespace? '.' + event.namespace: ''),
				element = (event.data && event.data.name)? event.data.name : element;

			/**
			 * Strip day/month/year from element name
			 */
			
			var re = new RegExp(/(-day)|(-month)|(-year)$/ig);
			
			element = element.replace(re, '');
			
			/**
			 * Fire events
			 */
						

			if(this._events.hasOwnProperty(element)){

				for(var e  in this._events[element]){

					if(utils._contains(e.split(/\s/), full_event)){
						
						if(this.options.methods.hasOwnProperty(this._events[element][e])){
							return this.options.methods[this._events[element][e]].call(this, event)
						}else{

							/**
							 * Throw an error                             
							 */
							throw new Error('Methods doesnt have the handler: '+ this._events[element][e])

						}
					}
				}

			}

			/* Prevent form submission */
						
			if(event.currentTarget.type && event.currentTarget.type === "submit") event.preventDefault();


		},

		detachEvents: function(){

			var self = this,
				element;
			
			for(var e in this._events){

				for(var event_name in this._events[e]){

					element = (e == '*')? ':input': '[name="'+e+'"]';
					
					this.$el.off(event_name, '[name="'+e+'"]', function(event){

						/* Call events from external Events API */
						
						self.options.methods[self._events[e][event_name]].call(self, event)
						
					})

				}

			}

		},

		

		API: function(){

			var self = this;


			/**
			 * Private
			 */
			
			this.getByName = function(name){

				return this.$el.find('[name="'+ name + '"]')
			}

			return {

				get: function(name, showText){
					

					var index = self._keys.indexOf(name),
						type = self._types[index],
						field = self._flatSchema[name]
					
					switch(field.type){

						case "string":
							
							/* Select field */

							if(field.fieldtype == "select"){
								
								var q = self.getByName(name)

								return showText? q.find('option:selected').text() : q.val()
							}

							/* Input fields */
							if(!field.hasOwnProperty('enum')){

								return self.getByName(name).val()
							}

							/* Radio and checkboxes */

							
							if(field.fieldtype == "radio") {

								return showText? self.getByName(name).filter(':checked').data('text') : self.getByName(name).filter(':checked').val()
							}
							
							return $.map(self.getByName(name).filter(':checked'), function(e, i){
								
								return showText? $(e).data('text'): e.value

							}).join(', ')                        

							//}
							break;


						case "date":                                        
							var date = self.getByName(name+'-day').val() + ' ' + self.getByName(name+'-month').val() + ' ' + self.getByName(name+'-year').val(),
								cleanDate = $.trim(date)

							return showText? (cleanDate || 'Not selected') : moment(date, 'DD MMMM YYYY');
							break;

						default:                    
							return self.getByName(name).val()
							break;
					}

				},

				set: function(name, value){

					var index = self._keys.indexOf(name),
						type = self._types[index],
						field = self._flatSchema[name]
					
					switch(type){

						case "date":

							if(self.getByName(name).length){

								return self.getByName(name).val(value)

							}else{

								var splitdate = value.toString().split(/\s/);
							
								self.getByName(name+'-day').val(Number(splitdate[0]))
								self.getByName(name+'-month').val(splitdate[1])
								self.getByName(name+'-year').val(Number(splitdate[2]))
							
							}

							if(!value){
								self.getByName(name+'-day').val('')
								self.getByName(name+'-month').val('')
								self.getByName(name+'-year').val('') 
							}
							
							break;

						case "radio":
							
							self.$el.find('[name="'+ name+ '"]')
								.filter(function(){
									return this.value == value
								})
								.prop("checked", true)

							return self.$el.find('[name="'+ name+ '"]').val(value)
							break

						default:
							return self.$el.find('[name="'+ name+ '"]').val(value)
							break;
					}
					

				},

				initValidation: function(){

					/* Validation Object from Schema */

					var validationObject = {
						rules: {},
						messages: {},
						groups: {},
						submitHandler: function(form){
							return false;
						}
					};
					
					for(prop in self._flatSchema){

						var hasRules = self._flatSchema[prop].hasOwnProperty('rules'),
							hasMessages = self._flatSchema[prop].hasOwnProperty('messages')

						/**
						 * Validation messages
						 */
						
						if(hasMessages){

							validationObject.messages[prop] = self._flatSchema[prop]['messages']
							
						}

						/**
						 * Validation rules
						 */

						if(hasRules){

							/* Check if its a date validation */

							switch(self._flatSchema[prop].type.toLowerCase()){

								case "date":
																
									/**
									 * 1. Add a group
									 * 2. Add validation rule for each field
									 * 3. Add validation message
									 */
									

									 if(self._flatSchema[prop].rules){
									
										/* 1 */
										validationObject.groups[prop+'-date'] = prop+"-day " + prop+"-month " + prop+"-year";
										
										/* 2 */

										validationObject.rules[prop+'-day'] = self._flatSchema[prop].rules
										validationObject.rules[prop+'-month'] = self._flatSchema[prop].rules
										validationObject.rules[prop+'-year'] = self._flatSchema[prop].rules

									}
									

									if(hasMessages && self._flatSchema[prop].messages.required){

										var msg = self._flatSchema[prop].messages
										
										/* 3 */

										validationObject.messages[prop+'-day'] = msg
										validationObject.messages[prop+'-month'] = msg
										validationObject.messages[prop+'-year'] = msg

									}

									/* Delete parent message */

									delete validationObject.messages[prop]

									break;

								default: 
									validationObject.rules[prop] = self._flatSchema[prop]['rules']
									break;
							}

							


						}

						
					}
					
					//console.log(validationObject)
								
					/* Validate the form */

					self.$el.find('form').validate(validationObject)

				},

				validate: function(){

					/* Add validation objects */

					this.initValidation();

					/* Return false: true */

					return self.$el.find('form').valid()
					
				},

				evaluate: function(){

			
					var calculations = {}


					/* Call init */

					self.options.methods.hasOwnProperty('init') && self.options.methods['init'].call(self, self)


					/**
					 * Validate the form
					 */
					
					if(!this.validate()) return ;

					
					/* Calculate result variables */
					
					$.each(self._calculations, function(key, value){
						
						if(self.options.methods.hasOwnProperty(value)){
							calculations[key] = self.options.methods[value].call(self, self)
						}
						
					})

					/* Add question variables */

					for(var k in self._keys){
						if(self._keys.hasOwnProperty(k)){
							calculations[self._keys[k]] = this.get(self._keys[k], true)
						}
					}            

					
					
					/* Output the results */

					$.ajax({
						url: self._results.template,
						dataType: 'html',
						success: function(template){
													
							/* Add results */
							
							self.$el
								.find('.'+self.options.resultClass)
								.html(Handlebars.compile(template)(calculations))
								.show()


							/* Hide continue button */                

							self.options.guided && self.$el.trigger('smartform.guidedEnd')

						}
						

					});

				},

				getQuestion: function(name){

					return self.$el
						.find('[data-question="'+name+'"]')                

				},

				hideQuestion: function(name){

					var $q = self.$el
						.find('[data-question="'+name+'"]')
						.addClass('smartform-inactive')

					if(!self.options.guided) $q.hide();

					this.refreshQuestions();

				},
				showQuestion: function(name){

					var $q = self.$el
						.find('[data-question="'+name+'"]')
						.removeClass('smartform-inactive')                

					if(!self.options.guided) $q.show();

					this.refreshQuestions();

				},

				hideObject: function(obj){

					var $q = self.$el
						.find('[data-object="'+obj+'"]')
						.addClass('smartform-inactive')
					
					if(!self.options.guided) $q.hide();

					this.refreshQuestions();

				},


				showObject: function(obj){


					var $q = self.$el
						.find('[data-object="'+obj+'"]')
						.removeClass('smartform-inactive')

					if(!self.options.guided) $q.show();

					this.refreshQuestions();

				},


				hideResult: function(){

					return self.$el.find('.'+self.options.resultClass).hide()

				},

				refreshQuestions: function(){
					

					/* Trigger change event */

					self.$el.trigger('smartform.guidedChange');

					
				},

				rules: function(action, element, rule, param){

					var name = element.data('question'),
						index = self._keys.indexOf(name),                        
						field = self._flatSchema[name],
						rules = {}

					/* Add a rule */

					rules[rule] = param;

					/* Check if you are removing a rule */

					(action == "remove") && (rules = rule)
					
					/* Add validation if not already added */

					this.initValidation()

					/* Add validation to fields */

					switch(field.type){

						/**
						 * Adds a validation rule to date
						 */

						case "date":
							self.getByName(name+'-day').rules(action, rules)
							self.getByName(name+'-month').rules(action, rules)
							self.getByName(name+'-year').rules(action, rules)
							break;

						default:
							self.getByName(name).rules("add", rules)
							break;
					}

					
				}
			}; // End return
		}

	}


	/**
	 * 
	 * Register to window
	 */
	
	window.SmartForm = SmartForm;


	
	/**
	 * Plugin method
	 */
	
	$.fn.extend({

		smartform: function(options){

			return this.each(function(){

				var $this = $(this),
					smartform = $this.data('smartform')

				$.data(this, 'smartform', new SmartForm(this, options))

			})

		}
	})

	
	

})(jQuery, Handlebars)