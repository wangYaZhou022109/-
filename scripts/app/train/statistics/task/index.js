exports.items = {
    main: 'main',
    'train/statistics/task/task-detail': { isModule: true }
};

exports.store = {
    models: {
        tasks: {
            url: '../train/task/tasks',
            type: 'pageable',
            root: 'items'
        },
        task: {
            url: '../train/task'
        },
        state: { data: {} },
    },
    callbacks: {
        init: function(payload) {
            var tasks = this.models.tasks,
                state = this.models.state;
            tasks.params = payload;
            state.data.classId = payload;
            state.changed();
            return this.get(tasks);
        },
        search: function(payload) {
            var tasks = this.models.tasks;
            tasks.params = payload;
            return this.get(tasks);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
