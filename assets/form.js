function ajax(option) {
    return $.ajax(option)
}

function Form(element, option) {
    this.option = $.extend({
        url: null,
        callback: function (res) {
            return res
        },
        modelKey : 'data-name'
        validOption: {}
    }, option)
    this.$element = $(element)
    this.init()
}
Form.prototype = {
    init: function () {
        var $submit = this.$element.find('[data-role=submit]')
        if ($submit.length) {
            $submit.on(this.option.submitEvent || 'click', $.proxy(this, 'submit'))
        }
        if (!this.option.url) {
            this.option.url = $submit.data('action') || this.$element.attr('action')
        }
    },
    valid: function (name) {
        if (name) {
            this.validElement(name)
        } else {
            this.validAll()
        }
    },
    validAll: function () {},
    validElement: function () {},
    data: function (key, value) {
        if (key && typeof value === undefined) {
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
    getSingleData: function ($item) {
        var modelKey = this.option.modelKey
        var name = $item.attr(modelKey)
        var val = $.trim($item.val())
        if (name === '') {
            return
        }
        // radio
        if ($item.attr('type') === 'radio') {
            val = '';
            $form.find('input[' + modelKey + '=' + name + ']').each(function(i, v) {
                if($(v).is(':checked')) {
                    val = $(v).val()
                }
            })
        }
        // checkbox
        if ($item.attr('type') === 'checkbox') {
            val = []
            $form.find('input[' + modelKey + '=' + name + ']:checked').each(function(i, v) {
                val.push($(v).val());
            })
            val = val.join(',')
        }
        return val
    }
    getAllData: function () {
        var self = this
        var modelKey = this.option.modelKey
        var result = {}
         this.$element.find('[' + modelKey + ']').each(function (i ,v) {
            var nameSpace
            var $item = $(v)
            var name = $item.attr(modelKey)
            var val = $.trim($item.val())
            if (name === '') {
                return
            }
            // radio
            if ($item.attr('type') === 'radio') {
                val = '';
                $form.find('input[' + modelKey + '=' + name + ']').each(function(i, v) {
                    if($(v).is(':checked')) {
                        val = $(v).val()
                    }
                })
            }
            // checkbox
            if ($item.attr('type') === 'checkbox') {
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

    setData: function () {},

    submit: function (option) {
        var ajaxOpt
        var e
        if (option.target) {
            e = option
            e.preventDefault()
            ajaxOpt = $(e.target).data('option') || {}
        } else {
            ajaxOpt = option
        }
        var self = this
        return ajax($.extend({
            url: this.url,
            data: this.data()
        }, ajaxOpt)).done(function (res) {
            return self.option.callback(res)
        })
    }
}
