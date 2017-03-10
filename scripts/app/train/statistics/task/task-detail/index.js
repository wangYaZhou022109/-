exports.items = {
    main: 'main',
    count: '',
    search: ''
};

exports.store = {
    models: {
        taskDetail: {
            url: '../train/task-detail/taskDetail',
            type: 'pageable',
            root: 'items'
        },
        taskd: {
            url: '../train/task-detail'
        },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var taskDetail = this.models.taskDetail;
            taskDetail.params = payload;
            return this.get(taskDetail);
        },
        search: function(payload) {
            var taskDetail = this.models.taskDetail;
            taskDetail.params = payload;
            return this.get(taskDetail);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.id);
};
