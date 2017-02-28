var _ = require('lodash/collection');

exports.bindings = {
    tasks: true
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'tasks' }
}];

exports.dataForTemplate = {
    tasks: function(data) {
        var tasks = data.tasks,
            pageNum = this.bindings.tasks.getPageInfo().page;
        _.map(tasks || [], function(task, i) {
            var e = task;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return tasks;
    }
};
