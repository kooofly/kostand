if(typeof Handlebars !== 'undefined') {
    Handlebars.registerHelper("if",function(v1, symbol, v2, options) {
        var result
        if (typeof symbol !== 'string') {
            options = symbol
            var conditional = v1
            if (Handlebars.Utils.isFunction(conditional)) { conditional = conditional.call(this); }

            if ((!options.hash.includeZero && !conditional) || Handlebars.Utils.isEmpty(conditional)) {
                result = options.inverse(this);
            } else {
                result = options.fn(this);
            }
        } else {
            switch (symbol) {
                case '==':
                    result = (v1 == v2 ? options.fn(this) : options.inverse(this))
                    break;
                case "===":
                    result = (v1 === v2 ? options.fn(this) : options.inverse(this))
                    break;
                case ">":
                    result = (v1 > v2 ? options.fn(this) : options.inverse(this))
                    break;
                case "<":
                    result = (v1 < v2 ? options.fn(this) : options.inverse(this))
                    break;
                case "!=":
                    result = (v1 != v2 ? options.fn(this) : options.inverse(this))
                    break;
            }
        }
        return result

    });
    Handlebars.registerHelper('toFixed', function(v, digits, option) {
        var result
        if(typeof v !== 'number') {
            result = ''
        } else {
            if(typeof digits === 'number') {
                result = v.toFixed(digits)
            } else {
                result = v.toFixed(2)
            }
        }

        return result;
    })
}