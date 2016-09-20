(function () {
    function Zclip(selector) {
        var client = new ZeroClipboard( $(selector) );
        client.on('ready', function (readyEvent) {
            client.on('copy', function (e) {
                var selector = $(e.target).data('copy') // || data-clipboard-text
                var copyText
                if (selector) {
                    copyText = $(selector).val()
                    e.clipboardData.setData("text/plain", copyText)
                }
            })
        })
        client.on('aftercopy', function (event) {
            $.plugs.modals.success('复制成功')
        });
    }
    $.plugs.Zclip = Zclip
})()