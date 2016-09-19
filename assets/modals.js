(function () {
    var modals = {}
    modals.success = function (message) {
        if (!$('#modal-success').length) {
            var template = '<div id="modal-success" class="modal fade" style="z-index: 1054" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-body"><div class="media"><div class="media-left"><i class="icon icon-ok text-success state"></i></div><div class="media-body message vm">' + message + '</div></div></div></div></div></div>'
            $(template).appendTo('body')
        } else {
            $('#modal-success .message').html(message)
        }
        $('#modal-success').modal({
            show: true,
            backdrop: false
        })
        setTimeout(function () {
            $('#modal-success').modal('hide')
        }, 1000)
    }

    modals.simple = function (message) {
        var template = '<div id="modal-simple" class="modal fade" style="z-index: 1053" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm modal-dialog-no-title"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div><div class="modal-body message">' + message + '</div></div></div></div>'
        if (!$('#modal-simple').length) {
            $(template).appendTo('body')
        } else {
            $('#modal-simple .message').html(message)
        }
        $('#modal-simple').modal('show')
    }

    modals.confirm = function (opt) {
        var option = $.extend({
            callback: $.noop,
            message: ''
        }, opt)
        if (!$('#modal-confirm').length) {
            var template = '<div id="modal-confirm" class="modal fade" style="z-index: 1053" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-body message">' + option.message + '</div><div class="modal-footer no-border"><button type="button" class="btn btn-primary" onclick="javascript: $(\'#modal-confirm\').trigger(\'confirm\')" data-dismiss="modal">确定</button> <button data-dismiss="modal"  onclick="javascript: $(\'#modal-confirm\').trigger(\'cancel\')" type="button" class="btn btn-link" data-dismiss="modal">取消</button></div></div></div></div>'
            $(template).appendTo('body')
            $('#modal-confirm').on('confirm', function () {
                option.callback(true)
            })
            $('#modal-confirm').on('cancel', function () {
                option.callback(false)
            })
        } else {
            $('#modal-confirm .message').html(option.message)
        }
        $('#modal-confirm').modal('show')
    }

    modals.error = function (message) {
        if (!$('#modal-error').length) {
            var template = '<div id="modal-error" style="z-index: 1055" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-body"><div class="media"><div class="media-left"><i class="icon icon-error text-danger state"></i></div><div class="media-body message vm">' + message + '</div></div></div><div class="modal-footer no-border"><button type="button" data-dismiss="modal" class="btn btn-primary">确定</button></div></div></div></div>'
            $(template).appendTo('body')
        } else {
            $('#modal-error .message').html(message)
        }
        $('#modal-error').modal('show')
    }

    modals.dialog = function (option) {
        /*var defaults = {
         id: '',
         className: '', // modal-sm modal-lg
         template: ''
         }*/
        if (!$('.modal-dialog').length) {
            var template = '<div id="' + option.id + '" class="modal-dialog modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog ' + option.className + '"><div class="modal-content">' + option.template + '</div></div>'
            $(template).appendTo('body')
        } else {
            $('#modal-error .message').html(message)
        }
        $('.modal-dialog').modal('show')
    }

    modals.loading = function (option) {
        if (option === 'hide') {
            $('#modal-loading').modal('hide')
        } else {
            if (!$('#modal-loading').length) {
                var template = '<div id="modal-loading" class="modal fade" style="z-index: 1053" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-body"><div class="media"><div class="media-left"><i class="icon icon-loading2 icon-rotate text-info state"></i></div><div class="media-body">使出了吃奶的劲疯狂的加载中，拼了老命了 <span class="fs">...</span></div></div></div></div></div></div>'
                $(template).appendTo('body')
            }
            $('#modal-loading').modal({
                show: true,
                backdrop: false
            })
        }
    }
    $.plugs.modals = modals
})()