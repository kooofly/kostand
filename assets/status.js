+function ($) {
    'use strict';
    var Status = function (el) {
        this.$element = $(el)
    }
    Status.prototype.activate = function(element, container) {
        var $active    = container.find('> .active')
        function next() {
            $active
                .removeClass('active')

            element
                .addClass('active')

        }
        next()
        this.val(element, container)
    }
    Status.prototype.val = function (element, container) {

        if (container.data('value') !== element.data('value')) {
            container.data('value', element.data('value'))
            container.trigger('change', element.data('value'))
        } else {
            container.data('value', element.data('value'))
        }
    }

    function Plugin(option) {
        var container = this.closest('[data-role=status]')
        var  data = container.data('bs.status')
        if (!data) container.data('bs.status', (data = new Status(container)))
        if (typeof option == 'string') data[option](this, container)
    }

    function clickHandler (e) {
        e.preventDefault()
        Plugin.call($(this), 'activate')
    }
    // status DATA-API
    // ============
    $(document)
        .on('click.bs.status.data-api', '[data-toggle="status"]', clickHandler)
    $.plugs.Status = Status
}(jQuery);