+function ($) {
    'use strict';
    // checkall DATA-API
    // ============
    $(document)
        .on('change.bs.checkall.data-api', '[data-role="checkall"]', function () {
            var $items = $($(this).data('toggle'))
            var value = $(this).is(':checked')
            $items.prop('checked', value)
        })
}(jQuery);