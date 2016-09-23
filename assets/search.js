(function () {
    function Search (element, option) {
        this.option = $.extend({
            url: null,
            isSearchNow: true, // 刚进入页面默认搜索一次
            beforeSearch: null, // 搜索前处理
        }, option)
        this.$element = $(element)
        this.form = new $.plugs.Form(element, option || {})
        this.model = this.form.model
        this.init()
    }
    Search.prototype = {
        init: function () {
            this.changeToggle()
            this.plugTogget()
            this.initSimpleSearch()
            this.initSearch()
            if (this.option.isSearchNow) {
                this.search()
            }
        },
        changeToggle: function () {
            if (this.option.show) {
                this.$element.find('[data-role=wrap]').removeClass('hide')
                this.$element.find('[data-role=toggle]').html('精简筛选条件 <span class="caret caret-up"></span>')
            } else {
                this.$element.find('[data-role=wrap]').addClass('hide')
                this.$element.find('[data-role=toggle]').html('更多筛选条件 <span class="caret"></span>')
            }
        },
        plugTogget: function () {
            var self = this
            this.$element.find('[data-role=toggle]').on('click', function () {
                self.option.show = !self.option.show
                self.changeToggle()
            })
        },
        initSimpleSearch: function () {
            var self = this
            this.$element.find('[data-role=search]').on('click', function (e) {
                e.preventDefault()
                var data = {}
                var $simpleInput = self.$element.find('[data-role=simple]')
                data[$simpleInput.attr('data-name')] = $simpleInput.val()
                // 分页参数
                data['pageSize'] = self.$element.find('[data-name=pageSize]').val()
                self.search({
                    data: data
                })
            })
        },
        initSearch: function () {
            var self = this
            this.$element.find('[data-role=submit]').unbind('click')
            this.$element.find('[data-role=submit]').on('click', function (e) {
                e.preventDefault()
                self.search()
            })
        },
        search: function (option) {
            var self = this
            var opt
            if (self.option.beforeSearch) {
                opt = {
                    data: self.option.beforeSearch.call(self, option)
                }
            } else {
                opt = option ? option : null
            }
            this.form.submit(opt).done(function (res) {
                self.$element.trigger('search', res, self)
            })
        }
    }

    $.plugs.Search = Search
})()