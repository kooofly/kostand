$(function () {

    // 复制代码
    /*var clip = new ZeroClipboard( $('._copy, #button .btn, #contrl .form-group, #modal .modals') );
    clip.on('copy', function (e) {
        var selector = $(e.target).data('copy') || e.target
        var html = $(selector)[0].outerHTML
        var $copy = $(html)
        $copy.removeClass('_copy').removeClass('zeroclipboard-is-hover').removeAttr('data-copy')
        $copy.find('.demo-tip').remove()
        var text = $copy[0].outerHTML
        console.log('复制成功', text)
        e.clipboardData.setData("text/plain", text)
    })*/

    // XX
    $('.wrap').each(function () {
        $(this).load($(this).data('url'))
    })
})