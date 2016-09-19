$(function () {
    var pathname = location.pathname
    var p = pathname.split('/')
    // active nav
    $('#nav a').each(function (i, v) {
        var href = $(this).attr('href')
        var m = href.split('/')
        if (p[1] === m[1]) {
            $(this).parent().addClass('active')
        }
    })
    // active sidebar
    $('#sidebar a').each(function (i, v) {
        var href = $(this).attr('href')
        var current = href.replace('..', '')
        if (pathname === current) {
            $(this).parent().addClass('active')
        }
    })
})