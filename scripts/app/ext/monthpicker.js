var D = require('drizzlejs'),
    $ = require('jquery');

D.ComponentManager.register('monthpicker', function(view, el, options) {
    var o = D.assign({
            changeYear: true,
            dateFormat: 'yy-MM',
            closeText: '关闭',
            prevText: '&#x3C;上月',
            nextText: '下月&#x3E;',
            yearSuffix: '年',
            isRTL: true,
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        }, options),
        e = $(el).monthpicker(o);
    return e;
}, function(view, comp) {
    var chart = comp.monthpicker();
    chart;
});
