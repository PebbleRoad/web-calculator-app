;(function(SmartForm){

	var fieldType = {

		transform: function(property, field, index, options, obj){

			var hbs_templates = SmartForm.themes;
			
			var _inputs = $.extend({}, field, {
				name     : property,
				index    : index,
				question: property,
				object : obj && obj.id
			}),
			templateType = options.guided? 'guided': 'flat';
			

			switch(field.type){

				case "string":

					/* For radio and checkboxes */

					if(field.hasOwnProperty('enum')){
						
						field.fieldtype = field.fieldtype || 'select';

						return Handlebars.compile(hbs_templates[templateType][field.fieldtype])(_inputs)
						
					}

					/* Input text fields */

					return Handlebars.compile(hbs_templates[templateType]['text'])(_inputs)
					
										

				case "date":

					_inputs.startYear = field.startYear || '2014';
					_inputs.endYear = field.endYear || '2025';

					/* Months */
					_inputs.months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December']


					/* Default date */

					if(field.hasOwnProperty('default')){

						var d = field['default'].split(/\s/);                        
						
						switch(d.length){

							case 3:
								_inputs.defaultDay = d[0]
								_inputs.defaultMonth = d[1]
								_inputs.defaultYear = d[2]
								
						}
					}

					return Handlebars.compile(hbs_templates[templateType][field.type])(_inputs)

				case "submit":
					
					/* Submit buttons */

					return Handlebars.compile(hbs_templates[templateType][field.type])(_inputs)

				case "reset":
					
					/* Submit buttons */

					return Handlebars.compile(hbs_templates[templateType][field.type])(_inputs)

				case "result":
					return '<div class="'+options.resultClass+'" />';
					break;
				
			}

		}
	}


	/* Exports */
	
	SmartForm.fieldtypes = fieldType;


})(SmartForm);