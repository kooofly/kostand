var V_number = Vue.component('V_number', {
    template: '<input class="form-control" digits="true" required :name="field + index" v-model="value" type="text"/>',
    props: {
        value: {
            twoWay: true
        },
        index: {},
        field: {},
        rowData: {
            type: Object
        }
    }
})
var V_number = Vue.component('V_handler', {
    template: '<a class="text-danger" href="javascript:;" @click="deleteRow(rowData)">删除</a>',
    props: {
        value: {
            twoWay: true
        },
        index: {},
        field: {},
        rowData: {
            type: Object
        }
    },
    methods: {
        deleteRow: function (row) {
            this.$root.model.$remove(row)
        }
    }
})

var V_delivery = Vue.component('V_delivery', {
    template: $('#template_delivery').length ? $('#template_delivery')[0].innerHTML : '<select class="form-control" required :id="field + index" :name="field + index" multiple="multiple"></select>',
    props: {
        value: {
            twoWay: true,
            default: function () {
                return []
            },
        },
        index: {},
        field: {},
        rowData: {
            type: Object
        }
    },
    data: function () {
        return {
            list: [],
            isChange: false,
            isRemove: false
        }
    },
    watch: {
        list: function (newVal) {
            var self = this
            var $el = $("#" + this.field + this.index)
            $el.select2({
                data: newVal
            })
            $el.val(self.value).trigger("change");
            $el
                .on('change', function (e) {
                    var v = $(this).val()
                    var newL = v.length
                    var oldL = self.value.length
                    self.isRemove = newL < oldL ? true : false
                    self.$set('value', v)
                    self.isChange = true
                })
                .on('select2:opening', function () {
                    if (self.isRemove) {
                        self.isRemove = false
                        return false
                    } else {
                        return true
                    }
                })
                .on('select2:closing', function (e) {
                    if (self.isChange) {
                        self.isChange = false
                        return false
                    } else {
                        return true
                    }
                })

        }
    },
    ready: function () {
        var self = this
        util.ajax({
            url: '../common/queryProvienceList.json'
        }).done(function (res) {
            var data = (function () {
                var result = []
                res.result.forEach(function (v) {
                    result.push({
                        id: v.name,
                        text: v.name
                    })
                })
                return result
            })()
            self.list = data
        })
    }
})
var V_price = Vue.component('V_price', {
    template: $('#template_price').length ? $('#template_price')[0].innerHTML : '<input class="form-control" min="0.01" number="true" required :name="field + index" v-model="value" type="text"/>',
    props: {
        value: {
            twoWay: true
        },
        index: {},
        field: {},
        rowData: {
            type: Object
        }
    },
    ready: function () {
        if (typeof this.value === 'number') {
            this.value = this.value.toFixed(2)
        }
    }
})
var VRender = Vue.extend({
    template: '<component v-if="render" :value.sync="value" :field="field" :index="index" :row-data.sync="rowData" :is="currentCom"></component><span v-else="render">{{value}}<input :name="field + index" :value="value" type="hidden"/></span>',
    props: {
        rowData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        value: {},
        index: {},
        field: {},
        render: {}
    },
    data: function () {
        return {
            currentCom: ''
        }
    },
    ready: function () {
        this.currentCom = this.getCurrentCom()
    },
    methods: {
        getCurrentCom: function () {
            return 'V_' + this.render
        }
    },
    components: {
        V_price: V_price,
        V_delivery: V_delivery
    }
})
var VueTable = Vue.extend({
    template: '<table class="table table-bordered table-hover"><thead><tr><th v-for="key in columns" :class="[sortKey == key.field ? \'active\' : \'\', key.className]" >{{key.name}}</th></tr></thead><tbody><tr v-for="(index, entry) in model"><td v-for="key in columns" :class="key.className"><v-render :value.sync="entry[key.field]" :field="key.field" :index="index" :row-data.sync="entry" :render="key.render"></v-render></td></tr></tbody></table>',
    //props: ['model', 'columns', 'map', 'sku', 'limit'],
    data: function () {
        return {
            columns: [],
            model: []
        }
    },
    methods: {
        addRow: function (o) {
            this.model.push(o || {})
        },
        deleteRow: function (row) {
            this.model.$remove(row)
        }
    },
    components: {
        VRender: VRender
    }
})
module.exports = VueTable