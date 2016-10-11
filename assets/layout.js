$(function () {
    var pathname = location.pathname
    var p = pathname.split('/')
    // active nav
    $('#nav a').each(function (i, v) {
        var href = $(this).attr('href')
        var m = href.split('/')
        if (p[p.length - 2] === m[m.length - 2]) {
            $(this).parent().addClass('active')
        }
    })
    // active sidebar
    $('#sidebar a').each(function (i, v) {
        var href = $(this).attr('href')
        var current = href.split('/')
        var p = pathname.split('/')
        if (p[p.length - 2] === current[current.length - 2] && p[p.length - 1] === current[current.length - 1]) {
            $(this).parent().addClass('active')
        }
    })
})