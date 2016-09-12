//补充handlebars的if
if(typeof Handlebars !== 'undefined') {
    Handlebars.registerHelper("if2",function(v1, v2, v3, options){
        var ret,
            val = options.fn(this),
            inverse = options.inverse(this);

        switch (v2) {
            case "==":
            case "===":
                ret = (v1 === v3 ? val : inverse);
                break;
            case ">":
                ret = (v1 > v3 ? val : inverse);
                break;
            case "<":
                ret = (v1 < v3 ? val : inverse);
                break;
            case ">=":
                ret = (v1 >= v3 ? val : inverse);
                break;
            case "<=":
                ret = (v1 <= v3 ? val : inverse);
                break;
            case "!=":
                ret = (v1 != v3 ? val : inverse);
                break;

        }

        return ret;
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