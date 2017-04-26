var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');

exports.title = '预定时间';

exports.bindings = {
    state: true,
    projects: true,
    month: true
};

exports.dataForTemplate = {
    state: function() {
        var data = this.bindings.state.data;
        return data;
    },
    projects: function() {
        var projects = this.bindings.projects.data,
            month = this.bindings.month.data,
            state = this.bindings.state.data;
        _.map(projects, function(data) {
            var project = data,
                arrays = new Array(project.days),
                currentDate,
                currentDateLong,
                index,
                flag = false,
                days = state,
                colspan = 0;
            _.map(arrays, function(arr, i) {
                var seconds = i * 24 * 60 * 60 * 1000;
                currentDateLong = project.classInfo.arriveDate + seconds;
                currentDate = helpers.date(currentDateLong);
                if (currentDate.indexOf(month) > -1) {
                    index = window.parseInt(currentDate.split('-')[2]) - 1;
                    if (days[index]) {
                        days[index].isOccupy = true;
                        days[index].text = '占用' + project.amount;
                        if (flag) {
                            days[index].isPass = true;
                        }
                        flag = true;
                        colspan++;
                    }
                }
            });
            _.map(days, function(day) {
                var d = day;
                if (d.isOccupy && !d.isPass) {
                    d.colspan = colspan;
                }
            });
            project.occupyDays = days;
        });
        return projects;
    }
};

exports.events = {
    'click rule': 'showRule'
};

exports.handlers = {
    showRule: function() {
        var me = this,
            model = me.module.items.tips;
        me.app.viewport.modal(model, {});
    }
};
