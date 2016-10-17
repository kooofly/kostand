var AttrCreator = Vue.extend({
    template: '<div><a class="btn btn-link"@click="addRow()"><i class="icon icon-add"></i>增加参数</a><div><label class="lbl">常用参数：</label><label class="checkbox-inline"v-for="v in commonList"><input type="checkbox"name="optionsCheckbox":value="v.name"v-model="commonly">{{v.name}}</label></div><table class="table table-bordered table-hover"style="margin-top: 10px;"><thead><tr><th class="text-center"width="220">参数名</th><th class="text-center"width="220">参数值</th><th class="text-center"width="160">操作</th></tr></thead><tbody><tr v-for="item in model" v-if="item.isDelete !== \'y\'"><td class="text-center vm"><input type="text"class="form-control"v-model="item.propName"></td><td class="text-center vm"><input type="text"class="form-control"v-model="item.propValue"></td><td class="text-center vm"><a class="btn btn-link text-danger"@click="deleteRow($index)"href="javascript:;">删除</a></td></tr></tbody></table></div>',
    data: function () {
        return {
            model: [],
            commonly: [],
            commonList: [],
            nameKey: null
        }
    },
    watch: {
        commonly: function (newVal, oldVal) {
            var self = this
            if (!this.nameKey) {
                var sample = this.commonList[0]
                for (var k in sample) {
                    this.nameKey = k
                }
            }

            var map = {}
            if (self.nameKey) {
                if (this.model.length) {
                    this.model.forEach(function (v, i) {
                        map[v[self.nameKey]] = true
                    })
                }
                if (newVal.length) {
                    newVal.forEach(function (v, i) {
                        var o = {}
                        if (!map[v]) {
                            o[self.nameKey] = v
                            self.addRow(o)
                        }
                    })
                }
            }
        }
    },
    methods: {
        addRow: function (o) {
            this.model.push(o || {})
        },
        deleteRow: function (index) {
            if (this.commonList.length) {
                this.commonlyHandler(index)
            }
            if (this.model[index].id) {
                this.$set('model[' + index + '].isDelete', 'y')
            } else {
                this.model.splice(index, 1)
            }
        },
        commonlyHandler: function (index) {
            var self = this
            this.commonly.forEach(function (v, i) {
                self.model[index][self.nameKey] === v && self.commonly.$remove(v)
            })
        }
    }
})
module.exports = AttrCreator