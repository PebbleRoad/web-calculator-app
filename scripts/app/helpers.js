;(function(Handlebars){
    
    Handlebars.registerHelper('times', function(n, block) {
        var accum = '';
        for(var i = 1; i <= n; ++i)
            accum += block.fn(i);
        return accum;
    });


    Handlebars.registerHelper('if_equals', function(a, b, opts) {
        if(a == b) // Or === depending on your needs
            return opts.fn(this);
        else
            return opts.inverse(this);
    });

    Handlebars.registerHelper('for', function(from, to, incr, block) {
        var accum = '';
        
        for(var i = parseInt(from); i <= parseInt(to); i += incr)
            accum += block.fn(i);
        return accum;
    });

    Handlebars.registerHelper('ifObject', function(item, options) {
        if(typeof item === "object") {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('pluralize', function(number, single, plural) {
        if (number === 1) { return single; }
        else { return plural; }
    });


})(Handlebars)