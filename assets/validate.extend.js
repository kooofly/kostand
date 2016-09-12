jQuery.validator.setDefaults({
    errorPlacement: function(error, element) {
        var helper = element.next('.help-block')
        if(helper.length) {
            helper.data('html', helper.html()).html(error);
        } else {
            helper = $('<div class="help-block" />')
            helper.data('html', '').html(error);
        }
        helper.insertAfter(element);
        element.parent().addClass('has-error');
        //console.log(error, element);
    },
    success: function(label, element) {
        //console.log(label, element);
        var helper = label.parent('.help-block');
        helper.html(helper.data('html')).parent('.has-error').removeClass('has-error');
    }
});

jQuery.validator.addMethod("phone", function(value, element) {
    var tel = /^1[3|5|7|8|][0-9]{9}$/;
    return this.optional(element) || (tel.test(value));
}, "请填写正确的手机号码");

jQuery.validator.addMethod("tel", function(value, element) {
    var tel = /^(0\d{2,3}-)?[1-9]\d{6,7}(-\d{1,4})?$/;
    return this.optional(element) || (tel.test(value));
}, "请填写正确的电话号码");

jQuery.validator.addMethod("telAreaCode", function(value, element) {
    var tel = /^[0-9]{3,4}$/;
    return this.optional(element) || (tel.test(value));
}, "请填写正确的电话区号");

jQuery.validator.addMethod("telNoAreaCode", function(value, element) {
    var tel = /^[0-9]{7,8}$/;
    return this.optional(element) || (tel.test(value));
}, "请填写正确的电话号码");

jQuery.validator.addMethod("chinaId", function(value, element) {
    var id = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    //var id = /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/;
    return this.optional(element) || (id.test(value));

}, "请填写正确的身份证号码");

jQuery.validator.addMethod("ScaleNumber",function(value,element,params){
    var v = value+"";
    if(v.indexOf(".") != -1){
        if(v.indexOf(".") == v.length -1){
            return false;
        }
        v = v.substring(v.indexOf(".")+1);
        if(v.length > params[1]){
            return false;
        }
    }else if(v.length > params[0]){
        return false;
    }
    return true;
},"请填写有效位数{0}位，小数位数{1}位的数");

/*自定义表单验证错误提示信息*/
jQuery.extend(jQuery.validator.messages, {
    required: "这是必填的哦",
    remote: "请修正该字段",
    email: "请输入正确格式的电子邮件",
    url: "请输入合法的网址",
    date: "请输入合法的日期",
    dateISO: "请输入合法的日期 (ISO).",
    number: "请输入合法的数字",
    digits: "只能输入正整数",
    creditcard: "请输入合法的信用卡号",
    equalTo: "请再次输入相同的值",
    accept: "请输入拥有合法后缀名的字符串",
    maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
    minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
    rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
    max: jQuery.validator.format("请输入一个最大为{0} 的值"),
    min: jQuery.validator.format("请输入一个最小为{0} 的值"),
    illegalchar: '请不要输入非法字符，那样不太好'
});

jQuery.validator.addMethod("isQQ", function(value, element) {
    var qq = /^[1-9][0-9]{4,9}$/;
    return this.optional(element) || (qq.test(value));
}, "请填写正确的QQ号码");

//非法字符过滤
jQuery.validator.addMethod("illegalchar", function(value, element) {
    return !/[@#\$%\^&\*\<\>]+/.test(value);
});

jQuery.validator.addMethod("decimal", function(value, element) {
    var decimal = /^-?\d+(\.\d{1,2})?$/;
    return this.optional(element) || (decimal.test(value));
}, "小数位数不能超过两位!");

jQuery.validator.addMethod("than", function(value, element, param) {
    var result = true;
    if(typeof param === 'string') {
        param = eval(param);
    }
    var $target = $(param[1]), symbol = param[0], targetV = + $target.val();
    value = + value
    if(typeof value === 'number' && typeof targetV === 'number') {
        switch (symbol) {
            case '<':
                result = (value <= targetV)
                break;
            case '>':
                result = (value >= targetV)
                break;
        }
    }
    return result;
}, "输入的值不在正确的范围之内");
// 修复bug min 最小为0不验证
jQuery.validator.addMethod("mi", function(value, element) {
    return value >= 0;
}, "请输入一个最小为0的值");

