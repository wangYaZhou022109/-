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
        projects: { url: '../train/project/findByDate' }
    },
    callbacks: {
        changeMonth: function(payload) {
            var month = this.models.month,
                state = this.models.state,
                occupy = this.models.occupy,
                projects = this.models.projects,
                newdate,
                days,
                arrays,
                weeks,
                item;
            month.data = payload.month;
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
        }
    }
};

exports.afterRender = function() {
    var newdate = new Date();
    newdate = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);
    return this.dispatch('changeMonth', { month: [newdate.getFullYear(), newdate.getMonth() + 1].join('-') });
};
