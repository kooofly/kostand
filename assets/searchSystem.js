(function () {
    function SearchSystem(option) {
        this.option = option
        this.init(option)
        option.plug && option.plug.call(this)
    }
    SearchSystem.prototype = {
        init: function (option) {

            var self = this

            // 初始化search
            self.searchEngine = new $.plugs.Search('#search', {
                url: option.url,
                isSearchNow: option.isSearchNow
            })
            window.___search = self.searchEngine
            self.searchEngine.$element.on('search', function (e, res) {
                self.searchType = 'normal'
                self.searchCall(res)
            })

            // 初始化pagination
            self.pagination = new $.plugs.Pagination('#pagination')
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
        },
        searchCall: function(res) {
            if (!this.option.callback.call(this, res)) {
                if (this.searchType !== 'pagination') {
                    this.pagination.render({
                        total: res.count
                    })
                }
            }
        }
    }
    $.plugs.SearchSystem = SearchSystem
})()