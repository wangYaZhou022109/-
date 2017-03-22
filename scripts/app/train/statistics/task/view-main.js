exports.bindings = {
    tasks: true,
    state: false,
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'tasks' }
}];

exports.events = {
    'click preview*': 'preview',
};

exports.handlers = {
    preview: function(data) {
        var me = this,
            model = me.module.items['train/statistics/task/task-detail'];
        me.app.viewport.modal(model, { id: data });
    }
};
