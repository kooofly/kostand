var util = {}
function isUndefined( value ) { return typeof value === 'undefined' }
function isDefined( value ) { return typeof value !== 'undefined' }
function isObject( value ) { return value != null && typeof value === 'object'; }
function isJsonObject( value ) { return isObject( value ) && toString.call( value ) === "[object Object]" }
function isString( value ) { return typeof value === 'string' }
function isNumber( value ) { return typeof value === 'number' }
function isDate( value ) { return Object.prototype.toString.call( value ) === '[object Date]' }
function isArray( value ) { return Object.prototype.toString.call( value ) === '[object Array]' }
function isFunction( value ) { return typeof value === 'function' }
function getMethodName( method ){ return method.toString().match( /function\s+(\w+)\s*\(/i )[1] }
function sliceArgs( args, startIndex ) { return [].slice.call( args, startIndex || 0 ) }
function arrayLikeToArray( arrayLike ) {
    var ret = []
    for ( var i = 0, j = arrayLike.length; i < j; i++ ) {
        ret.push( arrayLike[i] );
    }
    return ret;
}



(function() {
    var _exports = [
        isUndefined, isDefined, isObject, isJsonObject, isString, isNumber, isDate, isArray, isFunction, getMethodName, sliceArgs, arrayLikeToArray]
    for ( var i = 0, j = _exports.length; i < j; i++ ) {
        var obj = _exports[i]
        var name = getMethodName(obj)
        var v = obj
        util[name] = v
    }
})();

/**
 * ajax 通用处理
 * 理想 json 格式 ：
 * { data:'', info:'', error:false || true, callback: marked, type: {data:'datatype', info:'infotype'} || 'autoType' }
 */
util.isError = function(res) { return !res.success ;}
util.isSucc = function(res) { return !this.isError(res) ;}
util.data = function(res) { return res.data; }
util.info = function(res) { return res.info ;}
util.type = function(res, t) {
    var ret
    if(!res.type) ret = undefined;
    if(!t) {
        ret = res.type;
    } else {
        if(this.isJsonObject(res.type)){
            ret = res.type[t]
        } else {
            ret = res.type;
        }
    }
    return ret;
}
util.callback = function(res) { return res.callback; }

/**
 * ajax相关参数
 * querystring、serializeFormToObj、getUrlFromAction、getDataFromAction
 */
util.querystring = {
    _qsArr: function(isTop){
        var href = isTop ? top.location.href : location.href,
            index = href.indexOf('?'),
            params = href.substr(index + 1);
        return index == -1 ? [] : params.split('&');
    },
    //query string to obj
    qsToObj: function(isTop){
        var qsArr = this._qsArr(isTop);
        var obj = {};
        for (var i = 0; i < qsArr.length; i++) {
            var arrTemp = qsArr[i].split("=");
            obj[arrTemp[0]] = arrTemp[1];
        }
        return obj;
    },
    //get query string
    getQs: function(name,isTop){
        var ret = null;
        var qsArr = this._qsArr(isTop);
        if(!name){
            ret = {};
            for(var i = 0; i < qsArr.length; i++){
                var arrTemp = qsArr[i].split("=");
                ret[arrTemp[0]] = arrTemp[1];
            }
        } else {
            for(var i = 0; i < qsArr.length; i++){
                var arrTemp = qsArr[i].split("=");
                if( arrTemp[0].toUpperCase() == name.toUpperCase() )
                    return arrTemp[1];
            }
        }
        return ret;
    }
}

/**
 * promise ajax
 * @param ajaxOpt
 * @returns {Promise}
 * @example app.promise.ajax({...}, arg1, arg2).then(function done(res, arg1, arg2){},
 *                                                   function fail(res, arg1, arg2){},
 *                                                   function progress(bool, arg1, arg2){})
 */
util.ajaxCore = function (ajaxOpt) {
    var def = $.Deferred();

    var argNotifyStart,
        argNotifyEnd,
        argRe;
    var data = arrayLikeToArray(arguments);

    argNotifyStart = [].concat(data);
    argNotifyStart.splice(0, 1, true);
    def.notifyWith(this, argNotifyStart);

    $.ajax(ajaxOpt).done(function(res) {

        argNotifyEnd = [].concat(data)
        argNotifyEnd.splice(0, 1, false);
        argNotifyEnd.push(res);
        def.notifyWith(this, argNotifyEnd);

        argRe = [].concat(data)
        argRe.splice(0, 1, res);
        util.isSucc(res) ? def.resolveWith(this, argRe) : def.rejectWith(this, argRe);
    })
    return def;
}
util.ajax = function (option) {
    return this.ajaxCore($.extend({type: 'post', dataType: "json"}, option)).fail(function(res) {
        $.plugs.modals.error(res.info);
        return res;
    }).then(function (res) {
        if (res.info) {
            $.plugs.modals.success(res.info);
        }
        return res;
    })
}
Date.prototype.Format = function(fmt) {
    var o = {
        "M+" : this.getMonth() + 1, // 月份
        "d+" : this.getDate(), // 日
        "h+" : this.getHours(), // 小时
        "m+" : this.getMinutes(), // 分
        "s+" : this.getSeconds(), // 秒
        "q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
        "S" : this.getMilliseconds()
        // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    for ( var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
                ? (o[k])
                : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
window.util = util