var _ = require('lodash/collection');

exports.title = '预定时间';

exports.items = {
    content: 'content',
    toolbox: 'toolbox',
    tips: ''
};

exports.store = {
    models: {
        state: { data: {} },
        month: { data: {} },
        occupy: { url: '../train/occupy' },
        projects: { url: '../train/project/findByDate' },
        project: { },
        check: { url: '../train/occupy/check' },
    },
    callbacks: {
        changeMonth: function(payload) {
            var month = this.models.month,
                state = this.models.state,
                occupy = this.models.occupy,
                projects = this.models.projects,
                project = this.models.project,
                newdate,
                days,
                arrays,
                weeks,
                item;
            month.data = payload.month;
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
                    item = _.find(data, { day: r.day });
                    if (item) {
                        r.allowed = item.available;
                    }
                    arrays[i] = r;
                });
            });
            projects.params.month = payload.month;
            this.get(projects);
            state.clear();
            state.data = arrays;
            state.changed();
        },
        book: function(payload) {
            var check = this.models.check,
                project = this.models.project;
            check.set(payload);
            check.params.projectId = project.data.id;
            return this.get(check);
        }
    }
};

exports.afterRender = function() {
    var newdate = new Date(),
        project = this.renderOptions.project,
        year,
        month;
    newdate = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);
    year = newdate.getFullYear();
    month = newdate.getMonth() + 1;
    return this.dispatch('changeMonth', { month: [year, month].join('-'), project: project });
};
