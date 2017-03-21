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
        state: { data: { classId: 1 } },
    },
    callbacks: {
        init: function(payload) {
            var tasks = this.models.tasks;
            tasks.params = payload;
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
    var classId = this.store.models.state.data;
    this.dispatch('init', classId);
};
