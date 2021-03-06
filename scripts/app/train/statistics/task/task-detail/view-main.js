var _ = require('lodash/collection');

exports.title = '作业详情';

exports.bindings = {
    taskDetail: true,
    state: {}
};

exports.components = [{
    id: 'pager',
    name: 'pager',
    options: { model: 'taskDetail' }
}];

exports.dataForTemplate = {
    taskDetail: function(data) {
        var taskDetail = data.taskDetail || {},
            pageNum = this.bindings.taskDetail.getPageInfo().page;
        _.map(taskDetail || [], function(taskdetail, i) {
            var e = taskdetail;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return taskDetail;
    }
};
