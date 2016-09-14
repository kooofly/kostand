$(function () {

    $(document).on('rCopy', function (e, selector) {
        var clip = new ZeroClipboard( $(selector) );
        clip.on('copy', function (e) {
            var selector = $(e.target).data('copy') || e.target
            var html = $(selector)[0].outerHTML
            var $copy = $(html)
            $copy.removeClass('_copy').removeClass('zeroclipboard-is-hover').removeAttr('data-copy')
            $copy.find('.demo-tip').remove()
            var text = $copy[0].outerHTML
            console.log('复制成功', text)
            e.clipboardData.setData("text/plain", text)
        })
    })
    // XX
    $('.wrap').each(function () {
        $(this).load($(this).data('url'))
    })

    var d = {"result":[{"createTime":"2016-05-09 15:42:42","detailList":[{"dProNo":"125fa9dfb0ac4cf9ba6e67f48dae3694","detailStatusDesc":"","orderDetailId":24,"productName":"中华蟹","productPicPath":"http://192.168.1.238/group1/M00/00/CB/wKgB7lcq5NyAJes1AABT1_I41fs526_720x486.jpg","productPrice":"99.00","productQuantity":1,"productSkuInfo":"","refundStatus":"","sProductId":4,"showProUrl":"http://192.168.1.227/#!/detail/VILLAGE/125fa9dfb0ac4cf9ba6e67f48dae3694"}],"orderId":23,"orderNo":"20160509154242144208606","recipientName":"呃呃呃","recipientPhone":"15858288771","status":"WAIT_BUYER_PAY","statusDesc":"待付款","totalFreight":"12.00","totalPayment":"111.00","virtualOrderNo":"20160509154242130201305"},{"createTime":"2016-05-09 15:41:25","detailList":[{"dProNo":"125fa9dfb0ac4cf9ba6e67f48dae3694","detailStatusDesc":"","orderDetailId":23,"productName":"中华蟹","productPicPath":"http://192.168.1.238/group1/M00/00/CB/wKgB7lcq5NyAJes1AABT1_I41fs526_720x486.jpg","productPrice":"99.00","productQuantity":1,"productSkuInfo":"","refundStatus":"","sProductId":4,"showProUrl":"http://192.168.1.227/#!/detail/VILLAGE/125fa9dfb0ac4cf9ba6e67f48dae3694"}],"orderId":22,"orderNo":"20160509154125286209904","recipientName":"呃呃呃","recipientPhone":"15858288771","status":"WAIT_BUYER_PAY","statusDesc":"待付款","totalFreight":"12.00","totalPayment":"111.00","virtualOrderNo":"20160509154125275204503"},{"createTime":"2016-05-07 14:42:09","detailList":[{"dProNo":"b97e1b23fc804ad8a36f40cf9da47ec1","detailStatusDesc":"","orderDetailId":19,"productName":"中华蟹","productPicPath":"http://192.168.1.238/group1/M00/00/CB/wKgB7lcq5NyAJes1AABT1_I41fs526_720x486.jpg","productPrice":"121.00","productQuantity":6,"productSkuInfo":"","refundStatus":"","sProductId":4,"showProUrl":"http://192.168.1.227/#!/detail/VILLAGE/b97e1b23fc804ad8a36f40cf9da47ec1"}],"orderId":18,"orderNo":"20160507144209991201710","recipientName":"痛经典藏","recipientPhone":"13456917258","status":"TRADE_CLOSED","statusDesc":"已关闭","totalFreight":"12.00","totalPayment":"738.00","virtualOrderNo":"20160507144209978209409"},{"createTime":"2016-05-07 14:40:21","detailList":[{"dProNo":"b97e1b23fc804ad8a36f40cf9da47ec1","detailStatusDesc":"","orderDetailId":18,"productName":"中华蟹","productPicPath":"http://192.168.1.238/group1/M00/00/CB/wKgB7lcq5NyAJes1AABT1_I41fs526_720x486.jpg","productPrice":"121.00","productQuantity":1,"productSkuInfo":"","refundStatus":"","sProductId":4,"showProUrl":"http://192.168.1.227/#!/detail/VILLAGE/b97e1b23fc804ad8a36f40cf9da47ec1"}],"orderId":17,"orderNo":"20160507144021220206408","recipientName":"痛经典藏","recipientPhone":"13456917258","status":"WAIT_BUYER_PAY","statusDesc":"待付款","totalFreight":"12.00","totalPayment":"133.00","virtualOrderNo":"20160507144021205204007"},{"createTime":"2016-05-07 14:11:39","detailList":[{"dProNo":"b97e1b23fc804ad8a36f40cf9da47ec1","detailStatusDesc":"","orderDetailId":16,"productName":"中华蟹","productPicPath":"http://192.168.1.238/group1/M00/00/CB/wKgB7lcq5NyAJes1AABT1_I41fs526_720x486.jpg","productPrice":"99.00","productQuantity":1,"productSkuInfo":"","refundStatus":"","sProductId":4,"showProUrl":"http://192.168.1.227/#!/detail/VILLAGE/b97e1b23fc804ad8a36f40cf9da47ec1"},{"dProNo":"b97e1b23fc804ad8a36f40cf9da47ec1","detailStatusDesc":"","orderDetailId":17,"productName":"中华蟹","productPicPath":"http://192.168.1.238/group1/M00/00/CB/wKgB7lcq5NyAJes1AABT1_I41fs526_720x486.jpg","productPrice":"121.00","productQuantity":1,"productSkuInfo":"","refundStatus":"","sProductId":4,"showProUrl":"http://192.168.1.227/#!/detail/VILLAGE/b97e1b23fc804ad8a36f40cf9da47ec1"}],"orderId":16,"orderNo":"20160507141139034208704","recipientName":"","recipientPhone":"","status":"WAIT_BUYER_PAY","statusDesc":"待付款","totalFreight":"24.00","totalPayment":"244.00","virtualOrderNo":"20160507141139023209303"}],"count":1639,"success":true}

    var html = Handlebars.compile(tpl)([d.result[4]])
    $('#table').html(html)

    /*{{#each this}}
    1111111111111111111 <br>
    {{detailList.length}}
    {{#each detailList}}

    {{\#if @index}}
    1 <br>
    {{else}}
    0 <br>
    {{/if}}
    {{/each}}
    111111111111111111
    {{/each}}*/
})