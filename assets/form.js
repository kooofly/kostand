function ajax(option) {
    return util.ajax(option)
}

function isArray( value ) { return Object.prototype.toString.call( value ) === '[object Array]' }
function Form(element, option) {
    this.option = $.extend({
        url: null,
        callback: function (res) {
            return res
        },
        modelKey : 'data-name',
        validOption: {}
    }, option)
    this.$element = $(element)
    this.init()
}
Form.prototype = {
    init: function () {
        var $submit = this.$element.find('[data-role=submit]')
        if ($submit.length) {
            $submit.on(this.option.submitEvent || 'click', this, $.proxy(this, 'submit'))
        }
        if (!this.option.url) {
            this.option.url = $submit.data('action') || this.$element.attr('action')
        }
    },
    valid: function () {
        return this.validAll()
    },
    validAll: function () {
        var options = $.extend({
            onkeyup: false,
            onfocusin: false,
            /*onsubmit: true,
             onfocusout: false,
             onfocusin: false,
             onkeyup: false,*/
            ignore: '.ignore',

        }, this.option.validOption || {});

        var def = $.Deferred();
        var $form = this.$element;
        $form.validate(options);
        $form.valid() ? def.resolve($form) : def.reject($form);

        return def;
    },
    data: function (key, value) {
        if (key && typeof value === 'undefined') {
            return this.getData(key)
        } else if (key && value) {
            this.setData(key, value)
            return this
        } else if(!key) {
            return this.getAllData()
        }
    },
    getData: function (key) {
        var modelKey = this.option.modelKey
        var $target = this.$element.find('[' + modelKey +'=' + key +']')
        return this.getSingleData($target)
    },
    _getType: function ($item) {
        var result
        var type = $item.attr('type')
        if (type) {
            result = type
        } else {
            type = $item[0].type
            if (type === 'select-one') {
                result = 'select'
            } else {
                result = type
            }
        }
        return result
    },
    getSingleData: function ($item) {
        var modelKey = this.option.modelKey
        var name = $item.attr(modelKey)
        var val = $.trim($item.val())

        if (name === '') {
            return
        }
        // radio
        if (this._getType($item) === 'radio') {
            val = '';
            $item.each(function(i, v) {
                if($(v).is(':checked')) {
                    val = $(v).val()
                }
            })
        }
        // checkbox
        if (this._getType($item) === 'checkbox') {
            val = []
            $item.each(function(i, v) {
                if($(v).is(':checked')) {
                    val.push($(v).val());
                }
            })
            val = val.join(',')
        }
        // textarea
        if (this._getType($item) === 'textarea') {
            val = $item.html()
        }
        return val
    },
    getAllData: function () {
        var self = this
        var modelKey = this.option.modelKey
        var result = {}

        var $form = this.$element
        this.$element.find('[' + modelKey + ']').each(function (i ,v) {
            var nameSpace
            var $item = $(v)
            var name = $item.attr(modelKey)
            var val = $.trim($item.val())
            var tempObj = {}
            if (name === '') {
                return
            }
            // radio
            if (self._getType($item) === 'radio') {
                val = '';
                $form.find('input[' + modelKey + '=' + name + ']').each(function(i, v) {
                    if($(v).is(':checked')) {
                        val = $(v).val()
                    }
                })
            }
            // checkbox
            if (self._getType($item) === 'checkbox') {
                val = []
                $form.find('input[' + modelKey + '=' + name + ']:checked').each(function(i, v) {
                    val.push($(v).val());
                })
                val = val.join(',')
            }
            // 构建参数
            if (name.match(/\./)) {
                tempArr = name.split('.');
                nameSpace = tempArr[0];
                tempObj[ tempArr[1] ] = val;
                if (!result[ nameSpace ]) {
                    result[ nameSpace ] = tempObj;
                } else {
                    result[ nameSpace ] = $.extend({}, result[ nameSpace ], tempObj);
                }
            } else {
                result[name] = val;
            }
        })
        return result
    },

    setData: function (name, value) {
        var self = this
        var modelKey = this.option.modelKey
        var elements = {}
        var type
        this.$element.find('[' + modelKey + '=' + name + ']').each(function (i, v) {
            var $item = $(v)
            if (self._getType($item) === 'radio') {
                // radio
                if($item.val() == value) {
                    $item.prop('checked', true)
                }
            } else if (self._getType($item) === 'checkbox') {
                type = 'checkbox'
                // checkbox
                var checkVal = $item.val()
                $item.prop('checked', false)
                elements[checkVal] = $item
            } else if (self._getType($item) === 'select') {
                $item.children('option').each(function (i ,v) {
                    if(v.value == value) {
                        v.selected = true
                    }
                })
            } else if (self._getType($item) === 'textarea') {
                $item.html(value)
            } else {
                // text select
                $item.val(value)
            }
        })

        if (type === 'checkbox') {
            if (isArray(value)) {
                for (var m = 0, l = value.length; m < l; m++) {
                    elements [ value[m] ] && elements [ value[m] ].prop('checked', true)
                }
            } else {
                elements [ value ] && elements[value].prop('checked', true)
            }
        }
    },
    submit: function (option) {
        var ajaxOpt
        var e
        var self
        if (option.target) {
            e = option
            e.preventDefault()
            ajaxOpt = $(e.target).data('option') || {}
            self = e.data
        } else {
            ajaxOpt = option
            self = this
        }
        return this.valid().done(function () {
            var data = self.data()
            return ajax($.extend({
                url: self.url,
                data: data
            }, ajaxOpt)).done(function (res) {
                return self.option.callback(res)
            })
        })
    }
}
window.Form = Form