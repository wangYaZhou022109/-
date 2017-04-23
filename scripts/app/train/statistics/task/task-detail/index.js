exports.items = {
    main: 'main',
    count: 'count',
    search: 'search'
};

exports.store = {
    models: {
        taskDetail: {
            url: '../train/task-member/list',
            type: 'pageable',
            root: 'items'
        },
        taskOne: {
            url: '../train/task-member/one',
        },
        taskd: {
            url: '../train/task-member'
        },
        downAttach: {
            url: '../train/task-member/download'
        },
        state: { data: {} },
    },
    callbacks: {
        init: function(payload) {
            var taskDetail = this.models.taskDetail,
                taskOne = this.models.taskOne;
            taskDetail.params = payload;
            taskDetail.set({ id: payload.id });
            taskOne.params.id = payload.id;
            taskOne.clear();
            this.get(taskOne);
            return this.get(taskDetail);
        },
        search: function(payload) {
            var taskDetail = this.models.taskDetail,
                id = this.models.state.data.id;
            taskDetail.params = payload;
            taskDetail.params.id = id;
            return this.get(taskDetail);
        },
    }
};

exports.beforeRender = function() {
    var data = this.store.models.state.data;
    data.id = this.renderOptions.id;
    this.dispatch('init', { id: this.renderOptions.id });
};
