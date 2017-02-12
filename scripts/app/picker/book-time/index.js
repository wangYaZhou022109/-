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
        month: { data: {} }
    },
    callbacks: {
        changeMonth: function(payload) {
            var month = this.models.month,
                state = this.models.state,
                newdate,
                days,
                arrays,
                weeks;
            month.data = payload.month;
            newdate = new Date(month.data.split('-')[0], month.data.split('-')[1], 0);
            days = newdate.getDate();
            arrays = new Array(days);
            weeks = ['日', '一', '二', '三', '四', '五', '六'];
            _.map(arrays, function(arr, i) {
                var r = {};
                newdate.setDate(i + 1);
                r.day = i + 1;
                r.week = weeks[newdate.getDay()];
                r.allowed = Math.round(Math.random() * 300);
                arrays[i] = r;
            });
            state.clear();
            state.data = arrays;
            state.changed();
        }
    }
};
