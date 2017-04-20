var _ = require('lodash/collection');

exports.bindings = {
    taskDetail: true,
    state: {}
};

exports.components = [{
    id: 'pager',
    name: 'background-pager',
    options: { model: 'taskDetail' }
}];

exports.events = {
    'click downAll': 'attachAll',
};

exports.handlers = {
    attachAll: function() {
        this.module.dispatch('attachAll');
    },
};

exports.dataForTemplate = {
    taskDetail: function(data) {
        var taskDetail = data.taskDetail,
            pageNum = this.bindings.taskDetail.getPageInfo().page;
        _.map(taskDetail || [], function(taskdetail, i) {
            var e = taskdetail;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return taskDetail;
    }
};
