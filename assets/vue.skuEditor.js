Vue.config.debug = false
Vue.component('V_source', {
    template: '<div class="source"><div class="media" v-for="v in value"><div class="pull-right"><a class="delete" @click="deleteSource(v)" href="javascript:;">删除</a></div><div class="pull-left"><span class="name">{{v.farmerName}}</span></div><div class="media-body"><span class="proName">{{v.proName}}</span><div>库存：<input type="text" digits="true" mi="true" required :name=\'"stock" + index + $index\' class="stock-input" v-model="v.stock" /></div></div></div><a class="add" @click="addSource()" href="javascript:;">设置商品来源</a></div>',
    props: {
        value: {},
        index: {},
        rowData: {
            type: Object
        }
    },
    watch: {
        'rowData.traceList': {
            deep: true,
            handler: function (newVal) {
                var stock = 0
                newVal.forEach(function (v) {
                    var st = +v.stock
                    if( typeof st === 'number' && st === st) {
                        stock = Math.round((stock + st) * 100) / 100
                    }
                })
                this.$set('rowData.stock', stock)
            }
        }
    },
    ready: function () {
        if(!$(document).data('sourceReady')) {
            $(document).data('sourceReady', true)
            $(document).on('click', '.source-sel', function () {
                var json = JSON.parse($(this).val())
                var isExist = (function () {
                    var result = false
                    window.currentSource.rowData.traceList.forEach(function (v) {
                        if(json.farmerProductId === v.farmerProductId) {
                            result = true
                        }
                    })
                    return result
                })()
                if (isExist){
                    $.plugs.modals.error('此来源已存在，请不要重复添加哦')
                }
            })
        }
    },
    methods: {
        deleteSource: function (v) {
            var self = this
            if (v.id) {
                if (!this.$root.$get('delSkuTraceIdList')) {
                    this.$root.$set('delSkuTraceIdList', [])
                }
                ///////////////////////////////delSkuTraceIdList
                this.$root.delSkuTraceIdList.push(v.id)
            }
            this.rowData.traceList.$remove(v)
            var stock = 0
            self.rowData.traceList.forEach(function (v) {
                stock = Math.round((stock + v.stock) * 100) / 100
            })
            self.$set('rowData.stock', stock)
        },
        sourceData: function (currentPage) {
            return util.ajax({
                url: '../trace/farmerProductListData.json',
                data: {
                    pageSize: 5,
                    currentPage: currentPage
                }
            })
        },
        search: function (currentPage, template) {
            this.sourceData(currentPage).done(function (res) {
                var html = Handlebars.compile(template)(res.result)
                $('#source_table').html(html)
            })
        },
        addSource: function () {
            window.currentSource = this

            window.currentSource.sourceData(1).done(function(res) {
                var strWrap = '<div id="source_main" class="bootbox-body-inner"><div id="source_table"></div><div id="pagination-source" class="table-footer table-footer-noborder clearfix"></div></div>'
                var $wrap = $(strWrap)
                var strTable = '<table class="table table-condensed table-hover" id="table-list"><thead><tr><th>农户姓名</th><th>农产品名称</th><th>农产品数量</th><th>收购价(元)</th></tr></thead><tbody>        {{\#if this}}        {{#each this}}<tr><td><label><input class="source-sel" data-count="{{productCount}}" value=\'{"farmerName": "{{farmerName}}", "farmerId": {{farmerId}},"farmerProductId": {{id}}, "proName": "{{productName}}", "stock": {{productCount}} }\' type="checkbox" name="farmer"/>{{farmerName}}</label></td><td>{{productName}}</td><td>{{productCount}}</td><td>{{productBuyPrice}}</td></tr>        {{/each}}        {{else}}<tr><td colspan=\'4\'>暂无数据</td></tr>        {{/if}}</tbody></table>'
                var html = Handlebars.compile(strTable)(res.result)
                $wrap.find('#source_table').html(html)
                window.currentSource.dialog = bootbox.dialog({
                    title: '商品来源',
                    message: $wrap.html(),
                    buttons: {
                        cancel: {
                            label: '取消'
                        },
                        success: {
                            label: '确定',
                            callback: function () {
                                var array = []
                                $('.source-sel:checked').each(function (i, v) {
                                    var o = JSON.parse($(this).val())
                                    array.push(o)
                                })
                                window.currentSource.rowData.traceList = window.currentSource.rowData.traceList.concat(array)
                            }
                        }
                    }
                })
                var pagination = new $.plugs.Pagination({
                    element: '#pagination-source',
                    maxPagerCount: 7,
                })
                pagination.render({
                    total: res.count,
                    size: 5,
                    current: 1
                })
                pagination.$element.on('change', function(e, current, size) {
                    window.currentSource.search(current, strTable);
                })
            })


            /*bootbox.dialog({
                message: '<div id="source_select" class="bootbox-body-inner"><div class="media"><div class="pull-left"><label class="control-label">商品来源</label></div><div class="pull-right"><a id="btn-source" class="btn" href="javascript:;">选择来源</a></div><div class="media-body"><input id="source-text" class="form-control" readonly type="text"/></div></div><input id="source-val" type="hidden"/><div class="media"><div class="pull-left"><label class="control-label">商品库存</label></div><div class="media-body"><input id="source-stock" class="form-control" type="text"/></div></div></div>',
                buttons: {
                    success: {
                        label: '确定',
                        className: 'btn-primary',
                        callback: function () {
                            var o = $('#source-val').data('value')
                            var st = +$('#source-stock').val()
                            if (typeof st !== 'number' || st !== st){
                                util.alert('库存必须是数字')
                                return false
                            }
                            if(!o) {
                                util.alert('请选择来源')
                                return false
                            }
                            o.stock = st
                            self.rowData.traceList.forEach(function (v) {
                                if(v.productSkuId) {
                                    o.productSkuId = v.productSkuId
                                }
                            })
                            self.rowData.traceList.push(o)
                        }
                    }
                }
            })*/

        }
    }
})
Vue.component('V_routing', {
    template: $('#template_routing').length ?  $('#template_routing')[0].innerHTML : '<div class="routing"><div class="media"><div class="media-left"><label class="lbl">农户</label></div><div class="media-body"><input class="form-control" decimal="true" required :name="\'farmerSplitFee\' + index" placeholder="农户" v-model="value.farmerSplitFee" type="text"></div></div><div class="media"><div class="media-left"><label class="lbl">邮政</label></div><div class="media-body"><input class="form-control" decimal="true" required :name="\'postSplitFee\' + index" placeholder="邮政" v-model="value.postSplitFee" type="text"></div></div><div class="media"><div class="media-left"><label class="lbl">村站</label></div><div class="media-body"><input class="form-control" decimal="true" required :name="\'villageSplitFee\' + index" placeholder="村站" v-model="value.villageSplitFee" type="text"></div></div></div>',
    props: {
        value: {
            twoWay: true,
            type: Object
        },
        index: {},
        rowData: {
            type: Object
        }
    },
    watch: {
        value: {
            deep: true,
            handler: function (newVal) {
                var v
                if (newVal.farmerSplitFee && newVal.postSplitFee && newVal.villageSplitFee) {
                    v = +newVal.farmerSplitFee + +newVal.postSplitFee + +newVal.villageSplitFee
                    this.$set('rowData.salePrice', Math.round(v * 100) / 100)
                }
            }
        }
    }
})
Vue.component('V_price1', {
    template: '<input class="form-control text" than="[\'<\', \'[name=salePrice{{index}}]\']" decimal="true" required data-msg-required="请输入商品批发价" data-msg-than="批发价不能大于售价哦" :name="field + index" v-model="value" type="text"/>',
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
Vue.component('V_price2', {
    template: '<input class="form-control text" than="[\'>\', \'[name=wholesalePrice{{index}}]\']" decimal="true" required data-msg-required="请输入建议最低售价" data-msg-than="建议最低售价需要大于或等于批发价哦" :name="field + index" v-model="value" type="text"/>',
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
Vue.component('V_price3', {
    template: '<input class="form-control text" than="[\'>\', \'[name=minSuggestPrice{{index}}]\']" required data-msg-required="请输入建议最高售价" data-msg-than="建议最高售价需要大于或等于建议最低售价哦" :name="field + index" v-model="value" type="text"/>',
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
var V_source = Vue.component('V_source')
var V_price1 = Vue.component('V_price1')
var V_price2 = Vue.component('V_price2')
var V_price3 = Vue.component('V_price3')
var V_routing = Vue.component('V_routing')
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
        V_source: V_source,
        V_price1: V_price1,
        V_price2: V_price2,
        V_price3: V_price3,
        V_routing: V_routing,
        V_price: V_price,
        V_number:V_number
    }
})
var VBatch = Vue.extend({
    template: '<div class="vol clearfix"><div class="col-md-4"><div class="media"><div class="pull-left"><label class="control-label">批设置批发价</label></div><div class="media-body"><div class="media"><div class="pull-right"><a href="javascript:;" @click="volSet(\'wholesalePrice\', volWholesalePrice)" class="btn" data-id="{{id}}">确定</a></div><div class="media-body"><input v-model="volWholesalePrice" class="form-control" type="text"/></div></div></div></div></div><div class="col-md-4"><div class="media"><div class="pull-left"><label class="control-label">批设置建议最低售价</label></div><div class="media-body"><div class="media"><div class="pull-right"><a href="javascript:;" @click="volSet(\'minSuggestPrice\', volMinSuggestPrice)" class="btn" data-id="{{id}}">确定</a></div><div class="media-body"><input v-model="volMinSuggestPrice" class="form-control" type="text"/></div></div></div></div></div><div class="col-md-4"><div class="media"><div class="pull-left"><label class="control-label">批设置建议最高售价</label></div><div class="media-body"><div class="media"><div class="pull-right"><a href="javascript:;" @click="volSet(\'maxSuggestPrice\', volMaxSuggestPrice)" class="btn">确定</a></div><div class="media-body"><input v-model="volMaxSuggestPrice" class="form-control" type="text"/></div></div></div></div></div></div>',
    methods: {
        volSet: function (key, val) {
            this.$parent.model.forEach(function (v) {
                if (!v.checked) {
                    v[key] = val
                }
            })
        }
    }
})
/*var sku = [
    {
        text: '颜色',
        key: 'firstStandard',
        data: [
            {
                value: 'a',
                checked: true
            },
            {
                value: 'b',
                checked: true
            }
        ],
    }
]
var model = [
    {
        /!*firstStandard: 'a',*!/
        stock: 324,
        wholesalePrice: 45,
        minSuggestPrice: 234,
        maxSuggestPrice: 334,
        skuSplit: {farmerSplitFee: 32, postSplitFee: 111, villageSplitFee: 11 },
        traceList: []
    }
]*/
var SkuEditor = Vue.extend({
    template: '<div><a @click="addSkuAttr()" class="control-desc btn btn-link" href="javascript:;"><i class=" icon icon-add"></i> 新增规格</a><div class="attrs"><div class="media attr" v-for="item in sku"><div class="pull-left"><span class="control-label">{{item.text}}</span></div><div class="media-body"><div class="check-group"><label class="checkbox-inline" v-for="k in item.data"><input value="k.value" type="checkbox" v-model.sync="k.checked" name="item.key" @change="changeModel(k, item)"><span>{{k.value}}</span></label><a @click="addSku(item.data, item)" href="javascript:;">添加{{item.text}}</a></div></div></div></div><table class="table table-bordered table-hover"><thead><tr><th v-for="key in columns" :class="[sortKey == key.field ? \'active\' : \'\', key.className]" >{{key.name}}</th></tr></thead><tbody><tr v-for="(index, entry) in model" v-if="!entry.checked"><td v-for="key in columns" :class="key.className"><v-render :value.sync="entry[key.field]" :field="key.field" :index="index" :row-data.sync="entry" :render="key.render"></v-render></td></tr></tbody></table></div>',
    //props: ['model', 'columns', 'map', 'sku', 'limit'],
    data: function () {
        return {
            map: {},
            //用于搜索
            temp: null,
            sku: [],
            columns: [],
            //注： model 中 checked 为 true 表示删除的数据
            model: []
        }
    },
    ready: function () {
        var self = this
        this.sku.forEach(function (v) {
            self.columns.unshift({
                name: v.text,
                field: v.key
            })
        })
    },
    methods: {
        volSet: function (key, val) {
            this.model.forEach(function (v) {
                if (!v.checked) {
                    v[key] = val
                }
            })
        },
        // 支持map
        key: function (index) {
            return this.map[index + 1] || '_' + (index + 1)
        },
        // 添加SKU属性名
        addSkuAttr: function () {
            var self = this
            if (self.sku.length >= self.limit) {
                $.plugs.modals.error('最多添加' + self.limit + '个规格哦')
                return
            }

            bootbox.prompt({
                title: "规格名称",
                size: 'small',
                callback: function(result) {
                    if (result) {
                        var isRepeat = false
                        self.sku.forEach(function (v) {
                            if (v.text === result) {
                                isRepeat = true
                                return
                            }
                        })
                        if (!isRepeat) {

                            var index = self.sku.length
                            self.sku.push({
                                text: result,
                                key: self.key(index),
                                data: []
                            })
                            self.columns.unshift({
                                name: result,
                                field: self.key(index)
                            })
                        } else {
                            $.plugs.modals.error('相同的规格已添加，请勿重复添加')
                        }
                    }

                }
            })
        },
        // 添加SKU值
        addSku: function (v, item) {
            var self = this
            bootbox.prompt({
                size: 'small',
                title: "规格值",
                callback: function(result) {
                    if(result.length > 10) {
                        $.plugs.modals.error('规格名称过长')
                        return
                    }
                    var isExist = false
                    item.data.forEach(function (it) {
                        it.value === result && (isExist = true)
                    })

                    if(!isExist) {
                        var o = {
                            value: result,
                            checked: true
                        }
                        v.push(o)
                        self.changeModel(o, item)
                    } else {
                        $.plugs.modals.error('您设置的值已存在，请勿重复添加');
                    }

                },
            });

        },
        // === 单SKU处理Start
        isSkuZero: function (isChecked) {
            // 从0个sku到1个sku临界值判断
            var self = this
            var result = (function () {
                var rNotChecked = true
                var rChecked = 0
                self.sku.forEach(function (sk) {
                    for (var i = 0, j = sk.data.length; i < j; i++) {
                        var v = sk.data[i];
                        if (v.checked) {
                            rNotChecked = false
                            rChecked ++
                        }
                    }
                })

                return isChecked ? rChecked === 1 : rNotChecked
            })()
            return result
        },
        singleSKUMain: function (v, item) {
            var self = this
            var rowData = this.getRowData(v.value, item.key)[0]
            // 单SKU处理
            if (v.checked) {
                // 0个SKU到1个SKU
                if (self.isSkuZero(true)) {
                    var o = {}
                    o[item.key] = v.value
                    var isExsitColumn = (function () {
                        var result = false
                        for (var i = 0, j = self.columns.length; i < j; i++) {
                            var obj = self.columns[i];
                            if (item.key === obj.field) {
                                result = true
                                break
                            }
                        }
                        return result
                    })()
                    if (!isExsitColumn) {
                        self.columns.unshift({
                            name: item.text,
                            field: item.key
                        })
                    }
                    this.$set('model[' + 0 + ']', $.extend({}, this.model[0], o))

                } else {
                    rowData ? (rowData.rowData.checked = undefined) : this.addRowData(v.value, item)
                }

            } else {
                if (self.isSkuZero(false)) {
                    this.model.forEach(function (v, i) {
                        if (!i) {
                            self.sku.forEach(function (sk) {
                                if (v[sk.key]) {
                                    for (var m = 0, j = self.columns.length; m < j; m++) {
                                        var o = self.columns[m];
                                        if (o.field === sk.key) {
                                            self.columns.$remove(o)
                                            break
                                        }
                                    }
                                    v[sk.key] = undefined
                                }
                            })
                            v.checked = undefined
                        } else {
                            v.checked = true
                        }
                    })
                } else {
                    // 单sku删除
                    this.$set('model[' + rowData.index + '].checked', true)
                }

            }
        },
        // 单个sku添加
        addRowData: function (value, item) {
            var columns = this.columns
            var result = {}
            columns.forEach(function (v) {
                if (v.field === item.key) {
                    result[v.field] = value
                } else {
                    if (Object.prototype.toString.call(v.default) === '[object Array]') {
                        result[v.field] = [].concat(v.default)
                    } else if (Object.prototype.toString.call(v.default) === "[object Object]") {
                        result[v.field] = $.extend({}, v.default)
                    } else {
                        result[v.field] = v.default || ''
                    }
                }
            })
            this.model.push(result)
        },
        // === 单SKU处理END

        // 获取 行数据和行号
        getRowData: function (value, key) {
            var result = []
            this.model.forEach(function (v, i) {
                var r = {}
                if (v[key] === value) {
                    r.index = i
                    r.rowData = v
                    result.push(r)
                }
            })
            return result
        },

        // === 多SKU处理Start
        multiSKUMain: function (v, item) {
            // 多sku添加
            if (v.checked) {
                this.addRows(v.value, item)
            } else {
                // 多sku删除
                // 判断是否删除单行内的全部sku
                var isSKUExist = (function () {
                    var result = false
                    item.data.forEach(function (v) {
                        if (v.checked) {
                            result = true
                            return
                        }
                    })
                    return result
                })()
                if (isSKUExist) {
                    // 多SKU删除行
                    this.deleteRow(v.value, item)
                } else {
                    // 多SKU删除列
                    this.deleteCol(v.value, item)
                }
            }
        },

        deleteRow: function (value, item) {
            var self = this
            var rowData = this.getRowData(value, item.key)
            rowData.forEach(function (v, i) {
                v.rowData.checked = true

                self.$set('model[' + v.index + ']', $.extend({}, v.rowData))
            })
        },
        deleteCol: function (value, item) {
            var self = this
            this.columns.forEach(function (v) {
                if (v['field'] === item.key) {
                    self.columns.$remove(v)
                }
            })
            this.model.forEach(function (v, i) {
                self.$set('model[' + i + '].' + item.key, 'undefined')
            })
        },
        addTh: function (item) {
            var isExistTH = false
            this.columns.forEach(function (v) {
                if (item.key === v['field']) {
                    isExistTH = true
                }
            })
            if (isExistTH) return
            this.columns.unshift({
                name: item.text,
                field: item.key
            })
        },
        addRows: function (value, item) {
            var self = this
            var data = this._dataHandler2()
            var smp = data[0]
            var index = (function () {
                var i = 0
                for (var k in smp) {
                    i++
                }
                return i
            })()
            // 添加列
            this.addTh(item)
            var len = self.sku.length
            self.temp = [].concat(self.model)
            // 新增sku 第一个sku添加 需要保留之前的数据
            var isFirst = self.sku[len - 1].data.length === 1 || (function () {
                    var result = true
                    var flg = false
                    self.sku[len - 1].data.forEach(function (v) {
                        if (v.checked) {
                            if (flg) {
                                result = false
                            }
                            flg = true
                        }
                    })
                    return result
                })()
            if (isFirst) {
                self.$set('model', [])
                data.forEach(function (d, i) {
                    var res = self.searchModel(d, index)
                    if (res) {
                        if (res.checked) {
                            res.checked = undefined
                        }
                        self.model.push($.extend({}, res, d))
                    } else {
                        self.model.push(self.createRowData(d))
                    }
                })
            } else {
                data.forEach(function (d, i) {
                    var res = self.searchModel(d, index + 1)
                    if (!res) {
                        self.model.push(self.createRowData(d))
                    } else {
                        res.checked = undefined
                        //self.$set('model[' + i + '].checked', undefined)
                    }
                })
            }
        },
        /*
         * 处理数据成
         * [
         *   [{ firstStandard:'xxx', checked: false}, { secondStandard:'xxx'}],
         * ...] 用来后期处理数据使用
         * */
        _dataHandler1: function () {
            var result
            var watingForComb = []
            this.sku.forEach(function (sk) {
                var r = []
                sk.data.forEach(function (v) {
                    var o = {}
                    o[sk.key] = v.value
                    if (v.checked) {
                        r.push(o)
                    }
                    /* else {
                     o['checked'] = false
                     r.push(o)
                     }*/
                })
                watingForComb.push(r)
            })

            result = this.combination(watingForComb)
            return result
        },
        /*
         * 处理数据成
         * [
         *   { firstStandard:'xxx', secondStandard: 'yyy'},
         *   { firstStandard:'xxx', secondStandard: 'yzy' },
         * ...] 用于mix rowData
         * */
        _dataHandler2: function () {
            var result = []
            var array = this._dataHandler1()
            array.forEach(function (keys) {
                var o = {}
                keys.forEach(function (v) {
                    $.extend(o, v)
                })
                result.push(o)
            })
            return result
        },
        searchModel: function (d, index) {
            var result
            var condition = this.condition(d, index)
            result = _search(this.temp, condition)
            return result
            // 递归搜索
            function _search(data, condition) {
                var d = []
                var c = condition[0]
                data.forEach(function (v) {
                    for (var k in c) {
                        if (v[k] === c[k]) {
                            d.push(v)
                        }
                    }
                })
                condition.shift()
                if (d.length) {
                    if (condition.length) {
                        return _search(d, condition)
                    } else {
                        return d[0]
                    }
                } else {
                    return null
                }
            }
        },
        /*
         * 处理数据成
         * [
         *   { firstStandard:'xxx'},
         *   { secondStandard:'xxx'},
         * ...] 用于model搜索
         * */
        condition: function (o, index) {
            var result = []
            for (var i = 0; i < index - 1; i++) {
                var r = {}
                var k = this.key(i)
                r[k] = o[k]
                result.push(r)
            }
            return result
        },

        /*
         * 处理数据成
         * { firstStandard: 'a', stock: 324, price: '',  a: '', b: '', c: '', routing: {farmer: '', zip: '', village: ''}, source: [] },
         * 用来后期处理数据使用
         * */
        createRowData: function (o) {
            var columns = this.columns
            var result = {}
            columns.forEach(function (v) {
                if (o[v.field]) {
                    result[v.field] = o[v.field]
                } else {
                    if (Object.prototype.toString.call(v.default) === '[object Array]') {
                        result[v.field] = [].concat(v.default)
                    } else if (Object.prototype.toString.call(v.default) === "[object Object]") {
                        result[v.field] = $.extend({}, v.default)
                    } else {
                        result[v.field] = v.default || ''
                    }
                }
            })
            return result
        },
        // === 多SKU处理END
        changeModel: function (v, item) {
            var self = this
            var isSingleSKU = this.sku.length === 1 || (function () {
                    var index = 0
                    self.sku.forEach(function (it) {
                        for (var i = 0, j = it.data.length; i < j; i++) {
                            var d = it.data[i];
                            if (d.checked) {
                                index++
                                break
                            }
                        }
                    })
                    // 多个SKU变成单个SKU的临界值
                    var flg = false
                    item.data.forEach(function (r) {
                        if (r.checked) {
                            flg = true
                        }
                    })

                    return !flg ? index !== 1 : index <= 1
                })()
            if (isSingleSKU) {
                this.singleSKUMain(v, item)
            } else {
                this.multiSKUMain(v, item)
            }
        },
        //
        combination: function (combArray) {
            var heads = combArray[0];
            for (var i = 1, j = combArray.length; i < j; i++) {
                heads = this.addNewType(heads, combArray[i]);
            }
            return heads;
        },
        addNewType: function (heads, choices) {
            var result = [];
            for (var i = 0, j = heads.length; i < j; i++) {
                for (var m = 0, n = choices.length; m < n; m++) {
                    result.push([heads[i]].concat([choices[m]]))
                }
            }
            return result;
        }
    },
    components: {
        VRender: VRender,
        VBatch: VBatch
    }
})
module.exports = SkuEditor
// delSkuTraceIdList