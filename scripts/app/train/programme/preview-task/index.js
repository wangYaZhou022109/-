var D = require('drizzlejs');

exports.items = {
    head: 'head',
    main: 'main',
    side: 'side',
};

exports.store = {
    models: {
        state: {},
        mainState: { data: { isExplain: true } },
        task: { url: '../train/task' },
        preview: { url: '../human/file/preview' },
        download: { url: '../human/file/download' },
    },
    callbacks: {
        init: function(payload) {
            var task = this.models.task;
            task.set({ id: payload });
            return this.get(task);
        },
        preview: function(payload) {
            var state = this.models.state;
            D.assign(state.data || {}, payload);
            state.changed();
        },
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.id);
};

