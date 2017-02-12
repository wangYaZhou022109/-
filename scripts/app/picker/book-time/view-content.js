var _ = require('lodash/collection');

exports.title = '预定时间';

exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    state: function() {
        var state = this.bindings.state,
            newdate,
            days,
            arrays,
            weeks;
        if (state && state.data && state.data.length > 0) {
            return state;
        }
        newdate = new Date();
        newdate = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);
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
        state.data = arrays;
        return state;
    }
};

exports.events = {

};

exports.handlers = {

};

