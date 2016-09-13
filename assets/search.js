function Search (element, option) {
    this.option = option || {}
    this.$element = $(element)
    this.form = new Form(element, option && option.formOption ? option.formOption : {})
    this.model = this.form.model
    this.init()
}
Search.prototype = {
    init: function () {
        this.changeToggle()
        this.plugTogget()
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
            var $target = $(this)
            self.option.show = !self.option.show
            self.changeToggle()
        })
    }
}

window.Search = Search