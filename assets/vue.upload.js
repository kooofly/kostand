var UploadManager = Vue.extend({
    template: '<div id="upload-modal" v-if="show"><div class="layer"></div><div class="uploadManager"><div class="panel"><div class="panel-heading"><span class="title">{{selected ? selected : \'所有文件\'}}</span><div class="input-group search"><input type="text" v-model="q" class="form-control">							<span class="input-group-btn">								<button class="btn" @click="searchImagesByQ()" type="button">搜索</button>							</span></div><i @click="close()" class="close icon icon-error"></i></div><div class="panel-body wrap"><div class="clearix"><ul class="groups pull-left"><li class="item all" :class="!selected && \'active\'" @click="selectGroup(\'all\')">所有</li><li @click="selectGroup($index)" class="item" :class="v.selected && \'active\'" v-for="v in group"><span class="name">{{v.filesName}}</span></li></ul><div class="pull-left main"><ul id="dz-list" class="list clearfix"><li class="item"><a class="control-add" href="javascript:;"><i class="icon icon-add"></i></a></li><li id="previewsContainer"></li><li v-for="image in model" class="item" :class="image.selected && \'selected\'"><img @click="selectedImage($index)" :src="image.compressFilePath" alt=""><span class="ratio">{{image.width}} * {{image.height}}</span><div class="name tof"><span>{{image.pictureName}}</span></div></li></ul><div id="pagination-upload" class="clearfix wrap-p"></div></div></div></div><div class="panel-footer text-center"><button @click="selectDone()" class="btn btn-primary">确定</button></div></div></div></div>',
    props: {
        attrs: {
            type: Object
        }
    },
    data: function () {
        return {
            selectedAll: false, // 图片选择全部
            selected: '', // 组选择
            q: '', // 查询关键字
            searchOption: {
                pageSize: 17,
                currentPage: 1,
                pictureName: null // 查询关键字
            },
            show: false, // 是否显示
            model: [], // 图片渲染列表
            group: [], // 图片分组
            limit: false, // 最多选择图片数量
            parentImages: [] // 当此组件作为弹窗使用时，父组件的已有图片
        }
    },
    watch: {
        searchOption: {
            deep: true,
            handler: function () {
                this.renderImages()
            }
        },
        selectedAll: function (newVal) {
            var self = this
            this.model.forEach(function (v, i) {
                self.$set('model[' + i + '].selected', !!newVal)
            })
        },
        show: function (newVal) {
            if (newVal) {
                this.renderGroup()
                this.renderImages()
                this.initUpload()
                this.initPagination()
            }
        }
    },
    ready: function () {
        if (this.show) {
            this.renderGroup()
            this.renderImages()
            this.initUpload()
            this.initPagination()
        }
    },
    methods: {
        initUpload: function () {
            var self = this
            self.dropzone = new Dropzone('#dz-list', {
                url: '../fileUtil/saveUploadImageFile.do',
                clickable: '.control-add',
                previewTemplate: '<li class="item"><img class="preview" data-dz-thumbnail><div class="name tof" data-dz-name></div><div class="handler"><div class="progress"><div class="progress-bar progress-bar-success" data-dz-uploadprogress></div></div></div></li>',
                previewsContainer: '#previewsContainer',
                paramName: "fileData", // The name that will be used to transfer the file
                sending: function (fie, xhr, formData) {
                    formData.append('pictureFileId', self.searchOption.pictureFileId || '')
                },
                success: function (e, res) {
                    if (!res.success) {
                        util.alert(res.info)
                    } else {
                        self.renderImages()
                        /*var data = res.result
                        $(e.previewElement).remove()
                        self.model.unshift({
                            compressFileId: data.compressFileId,
                            compressFilePath: data.compressFilePath,
                            height: data.height,
                            id: data.pictureId,
                            pictureName: data.fileName,
                            sourceId: data.sourceId,
                            webpFileId: data.webpFileId,
                            sourceFilePath: data.sourceFilePath,
                            width: data.width
                        })
                        if(self.model.length === self.searchOption.pageSize) {
                            self.model.pop()
                        }*/
                    }
                }
            })
        },
        initPagination: function () {
            var self = this
            self.pagination = new Pagination({
                element: '#pagination-upload'
            })
            $('#pagination-upload').on('change', function(e, i, pageSize) {
                self.searchOption.currentPage = i
            })
        },
        close: function () {
            this.$remove()
        },
        batchGroup: function () {
            var self = this
            var selected = (function () {
                var result = []
                self.model.forEach(function (v) {
                    if (v.selected) {
                        result.push(v.id)
                    }
                })
                return result
            })()
            if (!selected.length) {
                util.alert('请选择需要修改分组的图片')
            } else  {
                bootbox.dialog({
                    title: '选择分组',
                    message: (function () {
                        var result = '<select id="batchGroup" class="form-control"><option value="">取消分组</option>'
                        self.group.forEach(function (v) {
                            result += '<option value="' + v.id + '">' + v.filesName + '</option>'
                        })
                        result += '</select>'
                        return result
                    })(),
                    className: 'bootbox-sm',
                    buttons: {
                        success: {
                            label: '确认',
                            className: 'btn-success',
                            callback: function () {
                                var v = $('#batchGroup').val()
                                util.ajax({
                                    url: '../imageDetail/batchUpdate.do',
                                    data: {
                                        pictureFileId: v,
                                        list: JSON.stringify(selected)
                                    }
                                }).done(function () {
                                    self.renderImages()
                                })
                            }
                        }
                    }
                })

            }
        },
        batchDelete: function () {
            var self = this
            var selected = (function () {
                var result = []
                self.model.forEach(function (v) {
                    if (v.selected) {
                        result.push(v.id)
                    }
                })
                return result
            })()
            if (!selected.length) {
                util.alert('请选择需要删除的图片')
            } else  {
                util.confirm({
                    message: '确认要删除选中的图片吗？',
                    success: function () {
                        util.ajax({
                            url: '../imageDetail/batchDelete.do',
                            data: {
                                list: JSON.stringify(selected)
                            }
                        }).done(function () {
                            self.renderImages()
                        })
                    }
                })
            }
        },
        selectedImage: function (i) {
            this.$set('model[' + i + '].selected', !this.model[i].selected)
        },
        selectDone: function () {
            var self = this
            var selected = (function () {
                var result = []
                self.model.forEach(function (v) {
                    if (v.selected) {
                        var isHas = false
                        self.parentImages.forEach(function (item) {
                            if (v.id === item.id) {
                                isHas = true
                            }
                        })
                        !isHas && result.push(v)
                    }

                })
                return result
            })()

            if (selected.length > this.limit) {
                util.alert('超过图片限制，请删除后再添加')
            } else {
                this.$dispatch('select-done', selected)
                this.model.forEach(function (v, i) {
                    self.$set('model[' + i + '].selected', false)
                })
                this.close()
            }
        },
        editImage: function (v) {
            if (typeof v === 'number') {
                this.$set('model[' + v + '].editState', true)
                this.$set('model[' + v + '].oldName', this.model[v].pictureName)
            } else {
                if (v.pictureName) {
                    util.ajax({
                        url: '../imageDetail/update.do',
                        data: {
                            id: v.id,
                            pictureName: v.pictureName
                        }
                    }).done(function (res) {
                        v.editState = false
                    })
                } else {
                    v.pictureName = v.oldName
                    v.editState = false
                }

            }
        },
        deleteImage: function (image) {
            var self = this
            util.ajax({
                url: '../imageDetail/delete.do',
                data: {
                    id: image.id
                }
            }).done(function (res) {
                self.model.$remove(image)
            })
        },
        searchImagesByQ: function () {
            this.$set('searchOption.pictureName', this.q)
            this.$set('searchOption.currentPage', 1)
        },
        renderImages: function (o) {
            var self = this
            self.selectedAll = false
            util.ajax({
                url: '../imageDetail/queryList.do',
                data: $.extend({}, self.searchOption, o || {})
            }).done(function (res) {
                self.model = res.list
                self.pagination.render({
                    size:self.searchOption.pageSize,
                    total: res.count,
                    currentPage: self.searchOption.currentPage
                })
            })
        },
        renderGroup: function () {
            var self = this
            util.ajax({
                url: '../imageResource/queryList.do'
            }).done(function (res) {
                self.group = res.list
            })
        },
        selectGroup: function (index) {
            var self = this
            this.$set('searchOption.pictureName', '')
            this.$set('searchOption.currentPage', 1)
            if (index === 'all') {
                this.selected = ''
                this.group.forEach(function (v, i) {
                    self.$set('group[' + i + '].selected', false)
                    self.$set('searchOption.pictureFileId', '')
                })
            } else {

                this.group.forEach(function (v, i) {
                    if (index === i) {
                        self.$set('group[' + i + '].selected', true)
                        self.$set('searchOption.pictureFileId', v.id)
                        self.selected = v.filesName
                    } else {
                        self.$set('group[' + i + '].selected', false)
                    }
                })
            }
        },
        deleteGroup: function (o) {
            var self = this
            util.ajax({
                url: '../imageResource/delete.do',
                data: {
                    id: o.id
                }
            }).done(function (res) {
                self.group.$remove(o)
            })
        },
        addGroup: function () {
            var self = this
            bootbox.prompt({
                title: "分组名称",
                callback: function(result) {
                    if (result) {
                        util.ajax({
                            url: '../imageResource/add.do',
                            data: {
                                filesName: result
                            }
                        }).done(function (res) {
                            self.renderGroup()
                            $.growl({ title: "添加成功", message: '' })
                        })
                    } else {
                        if (result !== null) {
                            $('.bootbox-form').addClass('has-error')
                            $('.bootbox-form').append('<div class="help-block">请填写分组名称</div>')
                            $('.bootbox-input-text').on('blur', function () {
                                if ($(this).val()) {
                                    $('.bootbox-form').removeClass('has-error')
                                    $('.bootbox-form .help-block').remove()
                                }
                            })
                            return false;
                        }
                    }
                },
                className: "bootbox-sm"
            })
        },
        editGroup: function (o) {
            bootbox.prompt({
                title: "分组名称",
                callback: function(result) {
                    if (result) {
                        util.ajax({
                            url: '../imageResource/update.do',
                            data: {
                                id: o.id,
                                filesName: result
                            }
                        }).done(function (res) {
                            o.filesName = result
                        })
                    }
                },
                className: "bootbox-sm"
            })
        }
    },
    events: {
        modal: function (limit, images) {
            this.limit = limit
            this.show = true
            this.parentImages = images

            this.$appendTo('body')
        }
    }
})
