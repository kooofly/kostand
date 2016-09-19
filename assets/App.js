function App (option) {
    var self  = this
    $(function () {
        self._init(option)
    })
}
App.prototype = {
    _init: function (option) {
        this._attr(option)
        this._fn(option)
        this._events(option)
        for (var key in option) {
            this[key] = option[key].call(this)
        }
    },
    _attr: function (option) {
        var attr = option.attr
        if (option.attr) {
            for (var key in attr) {
                this[key] = attr[key]
            }
            delete option.attr
        }

    },
    _fn: function (option) {
        var fn = option.fn
        if (option.fn) {
            for (var key in fn) {
                this[key] = fn[key]
            }
            delete option.fn
        }
    },
    _events: function (option) {
        var events = option.events
        for (var key in events) {
            events[key].call(this)
            delete option.events
        }
    },
}
window.App = App