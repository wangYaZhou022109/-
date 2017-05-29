var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers'),
    D = require('drizzlejs');

exports.title = '预定时间';

exports.items = {
    content: 'content',
    toolbox: 'toolbox',
    tips: ''
};

exports.store = {
    models: {
        state: { data: [] },
        month: { data: {} },
        occupy: { url: '../train/occupy' },
        projects: { url: '../train/project/findByDate' },
        limit: { url: '../train/limit-configuration/month' },
        project: { },
        result: { data: {} }
    },
    callbacks: {
        changeMonth: function(payload) {
            var month = this.models.month,
                state = this.models.state,
                occupy = this.models.occupy,
                projects = this.models.projects,
                project = this.models.project,
                limit = this.models.limit,
                newdate,
                days,
                arrays,
                weeks,
                item,
                monthArray;
            month.data = payload.month;
            monthArray = payload.month.split('-');
            project.data = payload.project;
            newdate = new Date(month.data.split('-')[0], month.data.split('-')[1], 0);
            days = newdate.getDate();
            arrays = new Array(days);
            weeks = ['日', '一', '二', '三', '四', '五', '六'];
            occupy.params.month = payload.month;
            this.get(occupy).then(function(data) {
                _.map(arrays, function(arr, i) {
                    var r = {};
                    newdate.setDate(i + 1);
                    r.day = i + 1;
                    r.week = weeks[newdate.getDay()];
                    item = _.find(data[0], { day: r.day });
                    if (item) {
                        r.allowed = item.available;
                        r.green = item.available >= project.data.amount;
                    }
                    arrays[i] = r;
                });
                state.clear();
                state.data = arrays;
                state.changed();
            });
            projects.params.month = payload.month;
            this.get(projects);
            projects.changed();
            limit.clear();
            D.assign(limit.params, { year: window.parseInt(monthArray[0]), month: window.parseInt(monthArray[1]) });
            this.get(limit);
        }
    }
};

exports.afterRender = function() {
    var newdate = new Date(),
        project = this.renderOptions.project,
        dateArray,
        dateStr;
    dateStr = helpers.date(newdate.getTime());
    dateArray = dateStr.split('-');
    return this.dispatch('changeMonth', { month: dateArray[0] + '-' + dateArray[1], project: project });
};

exports.buttons = [{
    text: '确定',
    fn: function() {
        var result = this.store.models.result.data;
        this.renderOptions.callback(result.arriveDate, result.returnDate);
    }
}];
