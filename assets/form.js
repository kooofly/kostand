(function () {
    function isArray( value ) { return Object.prototype.toString.call( value ) === '[object Array]' }
    function Form (element, option) {
        this.option = $.extend({
            url: null,
            modelKey : 'data-name',
            validOption: {},
            submitButton: null,
            dataSetPlug: null,
            noValid: false // 是否验证
        }, option)
        this.$element = $(element)
        this.model = {}
        this.currentAjaxOpt = {}
        this.init()
    }
    Form.prototype = {
        init: function () {
            var $submit = this.option.submitButton ? $(this.option.submitButton) : this.$element.find('[data-role=submit]')
            if ($submit.length) {
                $submit.on(this.option.submitEvent || 'click', this, $.proxy(this, 'submit'))
                this.$submit = $submit
            }
            if (!this.option.url) {
                this.option.url = $submit.data('url') || this.$element.attr('action')
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
            if ($form.length) {
                $form.validate(options);
                $form.valid() ? def.resolve($form) : def.reject($form);
            } else {
                def.resolve('no form')
            }
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
                // val = val.join(',')
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
                        if ($(this).data('single')) {
                            val = $(v).val()
                        } else {
                            val.push($(v).val());
                        }
                    })
                    // val = typeof val === 'string' ? val : JSON.stringify(val)
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
            self.option.dataSetPlug && self.option.dataSetPlug.call(this, result)
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
            var e = {}
            var self
            if (option && option.target) {
                e = option
                e.preventDefault()
                ajaxOpt = $(e.target).data('option') || {}
                self = e.data
            } else {
                ajaxOpt = option || {}
                self = this
            }
            $(document).off('hidden.bs.modal', '#modal-success')
            $(document).on('hidden.bs.modal', '#modal-success', function (event) {
                if (e.target) {
                    $(e.target).trigger('afterSuccess')
                }
            })
            var d = self.data()
            for (var k in d) {
                var v = d[k]
                if (typeof v === 'object') {
                    self.model[k] = JSON.stringify(v)
                } else {
                    self.model[k] = v
                }
            }
            self.model = self.data()
            if (self.option.noValid) {
                self.currentAjaxOpt = $.extend({}, {
                    url: self.option.url,
                    data: self.model
                }, ajaxOpt)
                return util.ajax(self.currentAjaxOpt).then(function (res) {
                    if (e.target) {
                        $(e.target).trigger('success', res)
                    }
                    return res
                })
            } else {
                return this.valid().then(function () {
                    self.currentAjaxOpt = $.extend({}, {
                        url: self.option.url,
                        data: self.model
                    }, ajaxOpt)
                    return util.ajax(self.currentAjaxOpt)
                }).then(function (res) {
                    if (e.target) {
                        $(e.target).trigger('success', res)
                    }
                    return res
                })
            }

        }
    }
    $.plugs.Form = Form
})()