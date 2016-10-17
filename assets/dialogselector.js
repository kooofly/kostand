(function () {
    function DialogSelector(option) {
        this.option = $.extend({
            renderTo: '#dialog-body',
            searchForm: '#dialog-search',
            pagination: '#dialog-pagination',
            isSearchNow: false,
            tempLayout: '<div class="panel mt10 mb0"><div class="panel-body pb0"><form id="dialog-search"></form><form id="dialog-body"class="com">{{>content}}</form><div id="dialog-pagination"class="com"></div></div></div>',
            template: null,
            registerPartial: 'content',
            callback: $.noop
        }, option)
        this.init(this.option)
    }
    DialogSelector.prototype = {
        init: function (option) {
            var self = this
            Handlebars.registerPartial(option.registerPartial, option.template);
            $(option.target).on('click', function () {
                self.dialog = bootbox.dialog({
                    size: 'large',
                    message: Handlebars.compile(option.tempLayout)([]),
                    buttons: {
                        cancel: {
                            label: '取消'
                        },
                        success: {
                            label: '确定',
                            callback: function () {
                                var form = new $.plugs.Form(self.option.renderTo, {
                                    noValid: true
                                })
                                return option.callback.call(self, form.data())
                            }
                        }
                    }
                })
                setTimeout(function () {
                    self.searchSys = new $.plugs.SearchSystem({
                        url: option.url,
                        tempLayout: option.tempLayout,
                        template: option.template,
                        renderTo: option.renderTo,
                        searchForm: option.searchForm,
                        pagination: option.pagination,
                        dataAdapter: option.dataAdapter,
                        isSearchNow: true
                    })
                }, 100)

            })

        }
    }
    $.plugs.DialogSelector = DialogSelector
})()