var statisticsInfo = [{ type: 0, name: 'PC' }, { type: 1, name: 'APP' }],
    integralInfo = [
        { type: 1, name: '讨论区' },
        { type: 2, name: '问道' },
        { type: 3, name: '知识库' },
        { type: 4, name: '个人信息' },
        { type: 5, name: '其他' }
    ],
    minute = 1000 * 60,
    hour = minute * 60,
    dateUtil = {
        hours: function(d, digits) {
            return (d / hour).toFixed(digits || 0);
        },
        minutes: function(d) {
            return (d / minute).toFixed() - (d / hour).toFixed();
        }
    };

exports.bindings = {
    statistics: true
};

exports.dataForTemplate = {
    totalStudyTime: function() {
        var studyTime = this.bindings.statistics.data.studyTime || {},
            studyTimeData = statisticsInfo.map(function(item) {
                return studyTime[item.type] || 0;
            }).reduce(function(a, b) { return a + b; });
        return dateUtil.hours(studyTimeData) + '小时' + dateUtil.minutes(studyTimeData) + '分';
    }
};

exports.components = [function() {
    var studyTime = this.bindings.statistics.data.studyTime || {},
        studyTimeData = statisticsInfo.map(function(item) {
            return { name: item.type + '', y: parseFloat(dateUtil.hours(studyTime[item.type] || 0, 2)) };
        });
    return {
        id: 'bar',
        name: 'highcharts',
        options: {
            chart: {
                type: 'bar'
            },
            xAxis: {
                categories: statisticsInfo.map(function(item) { return item.name; })
            },
            tooltip: {
                formatter: function() {
                    return dateUtil.hours(studyTime[this.key] || 0) + '小时'
                            + dateUtil.minutes(studyTime[this.key] || 0) + '分';
                }
            },
            series: [{
                data: studyTimeData
            }]
        }
    };
}, function() {
    var integral = this.bindings.statistics.data.integral || {},
        total = 0,
        integralData = integralInfo.map(function(item) {
            var currentIntegral = integral[item.type] || 0,
                totalTntegral = total;
            total = totalTntegral + currentIntegral;
            return { name: item.name, y: currentIntegral };
        });

    return {
        id: 'pie',
        name: 'highcharts',
        options: {
            chart: {
                type: 'pie'
            },
            title: {
                text: total + '<br>总积分',
                align: 'center',
                verticalAlign: 'middle',
                y: -30
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '{point.percentage:.1f}%&nbsp;来源{point.name}&nbsp;共{point.y}分</b>',
                useHTML: true
            },
            series: [{
                name: '积分',
                colorByPoint: true,
                innerSize: '50%',
                data: integralData
            }]
        }
    };
}];

exports.events = {
    'click rule': 'showRule'
};

exports.handlers = {
    showRule: function() {
        this.app.viewport.modal(this.module.items['center/integral']);
    }
};
