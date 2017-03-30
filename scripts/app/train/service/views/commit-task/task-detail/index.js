exports.items = {
    head: 'head',
    content: 'content',
    toolbox: 'toolbox'
};

exports.store = {
    models: {
        state: { data: {} },
        tasks: { url: '../train/task/task-list' }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state.data;
            state.taskId = payload;
            this.models.state.changed();
        },
        detail: function() {
            var tasks = this.models.tasks,
                state = this.models.state.data;
            tasks.params = { classId: state.classId };
            return this.get(tasks);
        }
    }
};

exports.beforeRender = function() {
    var me = this;
    me.dispatch('init', this.renderOptions.id);
};
