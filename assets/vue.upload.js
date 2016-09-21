var config = {
    // 上传控件flash路径
    swf: '../assets/webuploader/Uploader.swf',
    // 图片上传接口
    upload: '../shop/savePicture.jpeg',
    // 图片批量分组接口
    imageBatchGrouping: '../shop/modifyPictureGroup.json',
    // 图片批量删除接口
    imageBatchDelete: '../deletePicture/deleteGroup.json',
    // 编辑图片接口 图片改名
    imageEdit: '../shop/modifyPictureName.json',
    // 图片搜索接口
    imageSearch: '../shop/pictureLibraryListData.json',
    // 分组列表接口
    groupSearch: '../shop/queryPictureGroupList.json',
    // 分组删除接口
    groupDelete: '../shop/deleteGroup.json',
    // 添加修改分组接口
    groupEdit: '../shop/saveGroup.json'

}
var UploadManager = Vue.extend({
    template: '<div id="upload-modal" v-if="show"><div class="layer"></div><div class="uploadManager"><div class="panel"><div class="panel-heading"><span class="title">{{selected ? selected : \'所有文件\'}}</span><div class="input-group search"><input type="text" v-model="q" class="form-control">							<span class="input-group-btn">								<button class="btn" @click="searchImagesByQ()" type="button">搜索</button>							</span></div><button type="button" class="close" @click="close()" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div><div class="panel-body wrap"><div class="clearix"><ul class="groups pull-left"><li class="item all" :class="!selected && \'active\'" @click="selectGroup(\'all\')">所有</li><li @click="selectGroup($index)" class="item" :class="v.selected && \'active\'" v-for="v in group"><span class="name">{{v.filesName}}</span></li></ul><div class="pull-left main"><ul id="dz-list" class="list clearfix"><li class="item"><a class="control-add" href="javascript:;"><i class="icon icon-add"></i></a></li><li id="previewsContainer"></li><li v-for="image in model" class="item" :class="image.selected && \'selected\'"><img @click="selectedImage($index)" :src="image.compressFilePath" alt=""><span class="ratio">{{image.width}} * {{image.height}}</span><div class="name tof"><span>{{image.pictureName}}</span></div></li></ul><div id="pagination-upload" class="clearfix wrap-p"></div></div></div></div><div class="panel-footer text-center"><button @click="selectDone()" class="btn btn-primary">确定</button></div></div></div></div>',
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
            var uploader = self.uploader = WebUploader.create({

                // 自动上传。
                auto: true,

                // swf文件路径
                swf: config.swf,

                // 文件接收服务端。
                server: config.upload,

                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '.control-add',
                formData: {
                    groupId: self.searchOption.groupId || ''
                },
                // 只允许选择文件，可选。
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                }
            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on( 'uploadSuccess', function( file, res ) {
                if (!res.success) {
                    $.plugs.modals.error(res.info)
                } else {
                    self.renderImages()
                }
            });
            // 文件上传失败，上传出错。
            uploader.on( 'uploadError', function( file ) {
                var $li = $( '#'+file.id ),
                    $error = $li.find('div.error');

                // 避免重复创建
                if ( !$error.length ) {
                    $error = $('<div class="error"></div>').appendTo( $li );
                }

                $error.text('上传失败');
            });
        },
        initPagination: function () {
            var self = this
            self.pagination = new $.plugs.Pagination({
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
                $.plugs.modals.alert('请选择需要修改分组的图片')
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
                                    url: config.imageBatchGrouping,
                                    data: {
                                        groupId: v,
                                        pictureIds: JSON.stringify(selected)
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
                            url: config.imageBatchDelete,
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
                        url: config.imageEdit,
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
                url: config.imageBatchDelete,
                data: {
                    pictureIds: JSON.stringify([image.id])
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
                url: config.imageSearch,
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
                url: config.groupSearch
            }).done(function (res) {
                self.group = res.result
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
                        self.selected = v.groupName
                    } else {
                        self.$set('group[' + i + '].selected', false)
                    }
                })
            }
        },
        deleteGroup: function (o) {
            var self = this
            util.ajax({
                url: config.groupDelete,
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
                size: 'small',
                callback: function(result) {
                    if (result) {
                        util.ajax({
                            url: config.groupEdit,
                            data: {
                                groupName: result
                            }
                        }).done(function (res) {
                            self.renderGroup()
                            $.plugs.modals.success(res.info)
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
                            url: config.groupEdit,
                            data: {
                                id: o.id,
                                groupName: result
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
window.UploadManager = UploadManager
var UploadButton = Vue.extend({
    template: '<div class="uploadM"><div class="model"><span v-for="image in images" class="pull-left item"><img :src="image.compressFilePath" alt=""><i @click="deleteImage(image)" class="fa fa-times-circle text-danger"></i></span></div><a class="control-upload-btn" @click="upManager()" href="javascript:;"><i class="icon icon-add"></i></a><upload-manager></upload-manager></div>',
    props: {
        attrs: {
            type: Object
        }
    },
    data: function () {
        return {
            limit: false, // 最大选择图片数量
            replace: false, // 选择图片后替换之前选中的图片
            images: [], // 选中的图片
            onSelect: null
        }
    },
    watch: {

    },
    methods: {
        upManager: function () {
            if (this.replace) {
                this.modal()
            } else if (this.limit) {
                if (this.limit === this.images.length) {
                    util.alert('超过图片限制，请删除后再添加')
                } else {
                    this.modal()
                }
            } else {
                this.modal()
            }
        },
        modal: function () {
            if (this.replace) {
                this.$broadcast('modal', this.limit, this.images)
            } else {
                this.$broadcast('modal', this.limit - this.images.length, this.images)
            }
        },
        deleteImage: function (image) {
            this.images.$remove(image)
            typeof this.onRemove === 'function' && this.onRemove(image)
        }
    },
    events: {
        'select-done': function (images) {
            if (this.replace) {
                this.images = images
            } else {
                this.images = this.images.concat(images)
            }
            typeof this.onSelect === 'function' && this.onSelect(this.images)
        }
    },
    components: {
        'upload-manager': UploadManager
    }
})
module.exports = UploadButton