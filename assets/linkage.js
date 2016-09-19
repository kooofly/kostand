function Linkage(option) {
    var template = '<option value="{{value}}">{{text}}</option>'
    this.init(option)
}
Linkage.prototype = {
    init: function (option) {

    },

}


new Linkage([
    {
        element: '#a',
        url:'xx',
    },
    {
        element: '#b',
        url: 'xxx?a={a}',
    },
    {
        element: '#c',
        url: 'xxx?a={a}&b={b}',
    }
])