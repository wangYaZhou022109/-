exports.title = '作业提交';

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: { data: {} },
        tasks: { url: '../train/task/task-list' }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state.data;
            state.classId = payload;
            this.models.state.changed();
        },
        refeshList: function() {
            var tasks = this.models.tasks,
                state = this.models.state.data;
            tasks.params = { classId: state.classId };
            return this.get(tasks);
        }
    }
};

exports.beforeRender = function() {
    var me = this;
    me.dispatch('init', this.renderOptions.classId).then(function() {
        me.dispatch('refeshList');
    });
};
