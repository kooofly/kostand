(function () {
    function SearchSystem(option) {
        this.option = $.extend({
            plug: $.noop, // 特殊的搜索插件
            searchForm: '#search',
            pagination: '#pagination',
            url: null, // 数据链接
            template: null, // 搜索之后的模板
            renderTo: null, // 渲染到页面中的元素
            dataAdapter: $.noop, // 数据预先处理
            callback: function (res) {
                var data = option.dataAdapter ? option.dataAdapter(res) : res.result
                if (/^#/.test(option.template)) {
                    var template = $(option.template).html()
                    var html = Handlebars.compile(template)(data)
                    $(option.renderTo).html(html)
                } else if (/</.test(option.template)) {
                    var template = option.template
                    var html = Handlebars.compile(template)(data)
                    $(option.renderTo).html(html)
                } else {
                    $.ajax(option.template).done(function (template) {
                        var html = Handlebars.compile(template)(data)
                        $(option.renderTo).html(html)
                    })
                }
            }, // 搜索回调
            isSearchNow: true // 载入页面搜索一次
        }, option)
        this.init(this.option)
        this.option.plug && this.option.plug.call(this)
    }
    SearchSystem.prototype = {
        init: function (option) {

            var self = this

            if (option.searchForm) {
                // 初始化search
                self.searchEngine = new $.plugs.Search(option.searchForm, {
                    url: option.url,
                    isSearchNow: option.isSearchNow,
                    beforeSearch: option.beforeSearch
                })
                self.searchEngine.$element.on('search', function (e, res) {
                    self.searchType = 'normal'
                    self.searchCall(res)
                })
            }


            if (option.pagination) {
                // 初始化pagination
                self.pagination = new $.plugs.Pagination(option.pagination)
                self.pagination.$element.on('change', function (e, i, size) {
                    self.searchType = 'pagination'
                    var hData = self.searchEngine.form.currentAjaxOpt.data
                    var data = $.extend({}, hData, {
                        currentPage: i
                    })
                    self.searchEngine.search({
                        data: data
                    })
                })
            }


        },
        searchCall: function(res) {
            this.option.callback.call(this, res)
            if (this.searchType !== 'pagination') {
                this.pagination.render({
                    total: res.count
                })
            }
        }
    }
    $.plugs.SearchSystem = SearchSystem
})()