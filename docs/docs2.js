$(function () {

    $('[data-toggle=modal]').each(function(i, v) {
        var modal = $('#modal').clone()
        modal.attr('id', '_' + i)
        $(this).attr('data-target', '#_' + i)
        modal.appendTo('body')
    })
    /*$('.box').on('click', function () {
        var $target = $(this)
        var offset = $target.offset()
        var width = $target.outerWidth()
        var height = $target.outerHeight()
        var $dialog = $('<div class="box-copy" />')
        $dialog.css({
            width: width,
            height: height,
            left: offset.left,
            top: offset.top
        })
        $dialog.appendTo('body')
        var c = 1100
        $dialog[0].addEventListener('webkitTransitionEnd', function () {
            $dialog.addClass('dialog')
            var id = $target.data('id')
            $.ajax({
                url: './kostand/' + id + '.html'
            }).done(function (res) {
                $dialog.html(res)
            })

        })
        setTimeout(function () {
            var ww = $(window).width()
            var wh = $(window).height()
            var w = ww * .8 > c ? c : ww * .8
            var h = wh * .9
            var left = (ww - w) / 2
            var scTop = $(window).scrollTop()
            var top = (wh - h) / 2 + scTop

            $('.layer').addClass('layer-show')
            $dialog.css({
                width: w,
                height: h,
                left: left,
                top: top,
                background: '#fff',
                opacity: 1
            })
        })
    })

    $(document).on('click', function (e) {
        if ($(e.target).hasClass('box') || $(e.target).parents('.box').length || $(e.target).hasClass('dialog') || $(e.target).parents('.dialog').length) {
            return
        }
        $('.layer').removeClass('layer-show')
        $('.box-copy').remove()
    })*/
})