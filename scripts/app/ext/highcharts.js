var D = require('drizzlejs'),
    $ = require('jquery');

D.ComponentManager.register('highcharts', function(view, el, options) {
    var o = D.assign({
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            title: {
                text: '',
            },
            yAxis: {
                title: {
                    text: '',
                }
            },
            tooltip: {
                headerFormat: '',
                useHTML: true
            },
            plotOptions: {
                series: {
                    colorByPoint: true
                },
                bar: {
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                },
                pie: {
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
        }, options),
        e = $(el).highcharts(o);
    return e;
}, function(view, comp) {
    var chart = comp.highcharts();
    chart && chart.destroy();
});
