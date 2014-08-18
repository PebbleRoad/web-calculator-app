;(function(SmartForm){

    var themes = {

        flat: {

            radio: '<div class="smartform-question" data-answer-type="{{type}}" data-field-type="{{fieldtype}}" data-question="{{question}}" data-object="{{object}}">\
                    {{#if label}}<label>{{{label}}}</label>{{/if}}\
                    {{#each enum}}\
                        {{#ifObject this}}\
                            {{#each this}}\
                                <label class="label-radio label-inline">\
                                    <input type="radio" name="{{../../../name}}" {{#if_equals @key ../../../default}}checked {{/if_equals}} value="{{@key}}" data-text="{{this}}">{{this}}\
                                </label>\
                            {{/each}}\
                        {{else}}\
                        <label class="label-radio label-inline">\
                            <input type="radio" name="{{../../name}}" {{#if_equals this ../../default}}checked {{/if_equals}} value="{{this}}">\
                            {{this}}\
                        </label>\
                        {{/ifObject}}\
                    {{/each}}\
                    </div>',
            checkbox: '<div class="smartform-question" data-answer-type="{{type}}" data-field-type="{{fieldtype}}" data-question="{{question}}" data-object="{{object}}">\
                    {{#if label}}<label>{{{label}}}</label>{{/if}}\
                    {{#each enum}}\
                        {{#ifObject this}}\
                            {{#each this}}\
                                <label class="label-checkbox label-inline">\
                                    <input type="checkbox" name="{{../../../name}}" {{#if_equals @key ../../../default}}checked {{/if_equals}} value="{{@key}}" data-text="{{this}}">{{this}}\
                                </label>\
                            {{/each}}\
                        {{else}}\
                        <label class="label-checkbox label-inline">\
                            <input type="checkbox" name="{{../../name}}" {{#if_equals this ../../default}}checked {{/if_equals}} value="{{this}}">\
                            {{this}}\
                        </label>\
                        {{/ifObject}}\
                    {{/each}}\
                    </div>',
            text: '<div class="smartform-question" data-answer-type="{{type}}" data-field-type="{{fieldtype}}" data-question="{{question}}" data-object="{{object}}">\
                    <label>{{{label}}}</label>\
                    <input type="text" name="{{name}}">\
                    </div>',
            date: '<div class="smartform-question" data-answer-type="{{type}}" data-field-type="{{fieldtype}}" data-question="{{question}}" data-object="{{object}}">\
                    <label>{{{label}}}</label>\
                    {{#if description}}<span class="description">{{description}}</span>{{/if}}\
                    <select name="{{name}}-day">\
                        <option value="">Day</option>\
                        {{#times 31}}\
                            <option {{#if_equals this ../defaultDay}} selected{{/if_equals}}>{{this}}</option>\
                        {{/times}}\
                    </select>\
                    <select name="{{name}}-month">\
                        <option value="">Month</option>\
                        {{#each months}}\
                            <option {{#if_equals this ../defaultMonth}} selected{{/if_equals}}>{{this}}</option>\
                        {{/each}}\
                    </select>\
                    <select name="{{name}}-year" {{#if required}}required{{/if}}>\
                        <option value="">Year</option>\
                        {{#for startYear endYear 1}}\
                            <option {{#if_equals this ../defaultYear}} selected{{/if_equals}}>{{this}}</option>\
                        {{/for}}\
                    </select>\
                    </div>',

            submit: '<div class="smartform-submit">\
                        <button type="submit" name="{{name}}">{{label}}</button>\
                    </div>',
            reset: '<div class="smartform-reset">\
                        <button type="reset">{{label}}</button>\
                    </div>',
            select: '<div class="smartform-question" data-answer-type="{{type}}" data-field-type="{{fieldtype}}" data-question="{{question}}" data-object="{{object}}">\
                    <label>{{{label}}}</label>\
                    <select name="{{name}}">\
                    <option value="">Select</option>\
                    {{#each enum}}\
                        {{#ifObject this}}\
                            {{#each this}}\
                                <option value="{{@key}}" {{#if_equals @key ../../../default}}selected {{/if_equals}}>{{this}}</option>\
                            {{/each}}\
                        {{else}}\
                        <option value="{{this}}" {{#if_equals this ../default}}checked {{/if_equals}}>{{this}}</option>\
                        {{/ifObject}}\
                    {{/each}}\
                    </select>\
                    </div>'

        },

        guided: {

            radio: '<div class="smartform-question smartform-guided-question" data-answer-type="{{type}}" data-field-type="{{fieldtype}}" data-question="{{question}}" data-object="{{object}}"> \
                        <div class="smartform__question">\
                            <span class="smartform__number">{{index}}</span>\
                            <label>{{{label}}}</label>\
                        </div>\
                        <div class="smartform__answer">\
                            <a href="#" class="link--edit js-edit-link" data-edit-item="{{index}}">Edit</a>\
                            <div class="question__answer"></div>\
                            <div class="smartform__options">\
                            {{#each enum}}\
                                {{#ifObject this}}\
                                    {{#each this}}\
                                        <label class="label-radio label-inline">\
                                            <input type="radio" name="{{../../../name}}" {{#if_equals @key ../../../default}}checked {{/if_equals}} value="{{@key}}" data-text="{{this}}">{{this}}\
                                        </label>\
                                    {{/each}}\
                                {{else}}\
                                <label class="label-radio label-inline">\
                                    <input type="radio" name="{{../../name}}" {{#if_equals this ../../default}}checked {{/if_equals}} value="{{this}}" data-text="{{this}}">\
                                    {{this}}\
                                </label>\
                                {{/ifObject}}\
                            {{/each}}\
                            </div>\
                        </div>\
                    </div>',
            checkbox: '<div class="smartform-question smartform-guided-question" data-answer-type="{{type}}" data-field-type="{{fieldtype}}" data-question="{{question}}" data-object="{{object}}"> \
                        <div class="smartform__question">\
                            <span class="smartform__number">{{index}}</span>\
                            <label>{{{label}}}</label>\
                        </div>\
                        <div class="smartform__answer">\
                            <a href="#" class="link--edit js-edit-link" data-edit-item="{{index}}">Edit</a>\
                            <div class="question__answer"></div>\
                            <div class="smartform__options">\
                            {{#each enum}}\
                                {{#ifObject this}}\
                                    {{#each this}}\
                                        <label class="label-checkbox label-inline">\
                                            <input type="checkbox" name="{{../../../name}}" {{#if_equals @key ../../../default}}checked {{/if_equals}} value="{{@key}}" data-text="{{this}}">{{this}}\
                                        </label>\
                                    {{/each}}\
                                {{else}}\
                                <label class="label-checkbox label-inline">\
                                    <input type="checkbox" name="{{../../name}}" data-text="{{this}}" {{#if_equals this ../../default}}checked {{/if_equals}} value="{{this}}">\
                                    {{this}}\
                                </label>\
                                {{/ifObject}}\
                            {{/each}}\
                            </div>\
                        </div>\
                    </div>',
            date: '<div class="smartform-question smartform-guided-question" data-answer-type="{{type}}" data-field-type="{{fieldtype}}" data-question="{{question}}" data-object="{{object}}">\
                        <div class="smartform__question">\
                            <span class="smartform__number">{{index}}</span>\
                            <label>{{{label}}}</label>\
                            {{#if description}}<span class="description">{{description}}</span>{{/if}}\
                        </div>\
                        <div class="smartform__answer">\
                            <a href="#" class="link--edit js-edit-link" data-edit-item="{{index}}">Edit</a>\
                            <div class="question__answer"></div>\
                            <div class="smartform__options">\
                                <div class="row">\
                                    <div class="columns three three--tablet">\
                                        <select name="{{name}}-day">\
                                            <option value="">Day</option>\
                                            {{#times 31}}\
                                                <option {{#if_equals this ../defaultDay}} selected{{/if_equals}}>{{this}}</option>\
                                            {{/times}}\
                                        </select>\
                                    </div>\
                                    <div class="columns four four--tablet">\
                                        <select name="{{name}}-month">\
                                            <option value="">Month</option>\
                                            {{#each months}}\
                                                <option {{#if_equals this ../defaultMonth}} selected{{/if_equals}}>{{this}}</option>\
                                            {{/each}}\
                                        </select>\
                                    </div>\
                                    <div class="columns three three--tablet">\
                                        <select name="{{name}}-year" {{#if required}}required{{/if}}>\
                                            <option value="">Year</option>\
                                            {{#for startYear endYear 1}}\
                                                <option {{#if_equals this ../defaultYear}} selected{{/if_equals}}>{{this}}</option>\
                                            {{/for}}\
                                        </select>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>',

            submit: '<div class="smartform-submit">\
                        <button type="submit" name="{{name}}">{{label}}</button>\
                    </div>',
            reset: '<div class="smartform-reset">\
                        <button type="reset">{{label}}</button>\
                    </div>',
            text: '<div class="smartform-question smartform-guided-question" data-answer-type="{{type}}" data-field-type="{{fieldtype}}" data-question="{{question}}" data-object="{{object}}">\
                    <div class="smartform__question">\
                        <span class="smartform__number">{{index}}</span>\
                        <label>{{{label}}}</label>\
                    </div>\
                    <div class="smartform__answer">\
                        <a href="#" class="link--edit js-edit-link" data-edit-item="{{index}}">Edit</a>\
                        <div class="question__answer"></div>\
                        <div class="smartform__options">\
                            <input type="text" name="{{name}}">\
                        </div>\
                    </div>\
                    </div>',
                    
            select: '<div class="smartform-question smartform-guided-question" data-answer-type="{{type}}" data-field-type="{{fieldtype}}" data-question="{{question}}" data-object="{{object}}">\
                    <div class="smartform__question">\
                        <span class="smartform__number">{{index}}</span>\
                        <label>{{{label}}}</label>\
                        {{#if description}}<span class="description">{{description}}</span>{{/if}}\
                    </div>\
                    <div class="smartform__answer">\
                        <a href="#" class="link--edit js-edit-link" data-edit-item="{{index}}">Edit</a>\
                        <div class="question__answer"></div>\
                        <div class="smartform__options">\
                            <select name="{{name}}">\
                                <option value="">Select</option>\
                                {{#each enum}}\
                                    {{#ifObject this}}\
                                        {{#each this}}\
                                            <option value="{{@key}}" {{#if_equals @key ../../../default}}selected {{/if_equals}}>{{this}}</option>\
                                        {{/each}}\
                                    {{else}}\
                                    <option value="{{this}}" {{#if_equals this ../default}}checked {{/if_equals}}>{{this}}</option>\
                                    {{/ifObject}}\
                                {{/each}}\
                            </select>\
                        </div>\
                    </div>\
                </div>'
        }
        
    }

    /* Exports */
    
    SmartForm.themes = themes;

})(SmartForm)