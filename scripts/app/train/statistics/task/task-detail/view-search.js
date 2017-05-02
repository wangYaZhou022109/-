var $ = require('jquery');

exports.bindings = {
    taskDetail: true,
    downAttach: false,
    state: true,
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            name: $(this.$$('[name="name"]')).val(),
            fullName: $(this.$$('[name="fullName"]')).val(),
        };
    }
};

exports.dataForTemplate = {
    taskDetail: function(data) {
        var taskDetail = data.taskDetail || {},
            state = this.bindings.state.data;
        taskDetail.downUrl = this.bindings.downAttach.getFullUrl() + '?id=' + state.id;
        return taskDetail;
    }
};
