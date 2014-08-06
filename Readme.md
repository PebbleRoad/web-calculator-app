# Smartform

## Initialize

```
$(element).smartform({
    schema: schema,
    guided: true,
    methods: {
        submitHandler: function(){
            
            /* Evaluates the form */
            
            this.API().evaluate()

        },
        calculation_1: function(){
            
            return this.API().get('question_1') > 10
            
        }
    }
})

```

## Form Schema

```
"schema": {
    "q1": {
        "type": "date",
        "label": "When does the your application expire?",
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
        "action": "/url/submit",
        "exitOn": "fnNotEligible"
    },
    "events": {        
        "submit": {
            "click": "calculate"
        }
    },
    "calculations": {        
        "variable_1" : "calculation_1",
        "variable_2" : "calculation_2",
        "variable_3" : "calculation_3"
    }
}
```

## Handlebars Templates

Form results use `handlebars` templates. New helpers can be added in `helpers.js`

```
<h3>Variable 1 : {{variable_1}}</h3>
<h3>Variable 2 : {{variable_2}}</h3>
<h3>Variable 3 : {{variable_3}}</h3>
```

## Form events
Form events can be added in schema using:

```
{
    "events": {
        "question_name": {
            "event_name": "event_handler"
        }
    }
}
```

### Plugin events
Event name | Description
--- | ---
smartform.loaded | Triggered after form is appended to the page
smartform.guidedChange | Only triggered on guided form when user clicks `continue`. After validation
smartform.guidedEnd | End of a guided form

Events can be seperated using a `space`. Event handler will be a property of form `methods`

## Customizing form markup

Form markup can be modified in `templates.js`

## Plugin options
Attribute | Options | Default | Description
--- | --- | --- | ---
schema | *object* | null | url of the JSON schema file OR JSON object
guided | *string* | false | Is the form `flat` or `guided`?
methods | *object* | null | Methods used for form calculations


## Validation
We use [jqueryvalidation.org](jqueryvalidation.org) to validate the forms. Validation rules and messages can be added in the schema.

New validation rules can be added to `validators.js`

## API

Smartform API instance allows you to 

Method | Options | Description
--- | --- | ---
`get(question)` | `question` | Gets the value of the form field `question`
`set(question, value)` | `question`, `value` | Set value of a form field
`evaluate` | - | Evaluate the form
`validate` | - | Validates the form
`getQuestion(question)` | `question` | Return the question as a jQuery object
`hideQuestion(question)` | `question` | Hides selected question
`showQuestion(question)` | `question` | Shows selected question
`hideObject(object)` | `object` | Hides selected object
`showObject(object)` | `object` | Shows selected object
`rules(action,element, rule, param)` | - | Dynamically `add/remove` validation rules

## Unit tests

We use QUnit for unit testing. Test cases are written in JSON for each calculator. 

`qunit/specs/'` Contains Test Specs for each calculator
`qunit/test-cases'` Test cases for each calculator in JSON

Example of a test case

```
{
    "name": "Age calculator",
    "tests": [
        {
            "name": "Test 1",
            "data": {
                "dob": "01 January 2000"
            },
            "expected": {
                "fnAge": "15 years ago"
            }
        },
        {
            "name": "Test 2",
            "data": {
                "dob": "22 August 1984"
            },
            "expected": {
                "fnAge": "30 years ago"
            }
        }
    ]
}
```