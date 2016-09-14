(function () {
    function Search (element, option) {
        this.option = option || {
                isSearchNow: true // 刚进入页面默认搜索一次
            }
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
            this.$element.find('[data-role=search]').on('click', function () {

                var data = {}
                var $simpleInput = self.$element.find('[data-role=simple]')
                data[$simpleInput.attr('data-name')] = $simpleInput.val()
                self.search({
                    data: data
                })
            })
        },
        initSearch: function () {
            var self = this
            this.$element.find('[data-role=submit]').unbind('click')
            this.$element.find('[data-role=submit]').on('click', function () {
                self.search()
            })
        },
        search: function (option) {
            var self = this
            this.form.submit(option ? option : null).done(function (res) {
                self.$element.trigger('search', res, self)
            })
        }
    }

    $.plugs.Search = Search
})()