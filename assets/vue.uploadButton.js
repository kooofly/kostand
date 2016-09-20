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