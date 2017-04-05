var D = require('drizzlejs');
exports.items = {
    head: 'head',
    main: 'main',
    side: 'side',
};

exports.store = {
    models: {
        all: { url: '../train/task-member/all' },
        approval: { url: '../train/task-member/approval' },
        download: { url: '../human/file/download' },
        preview: { url: '../human/file/preview' },
        state: { data: {} },
    },
    callbacks: {
        init: function(payload) {
            var all = this.models.all,
            //     id = payload;
            // all.params = { id: id };
                state = this.models.state;
            state.data.id = payload.id;
            all.params = state.data;
            return this.get(all);
        },
        approval: function(payload) {
            var approval = this.models.approval,
                all = this.models.all,
                me = this;
            approval.set(payload);
            me.save(approval).then(function() {
                me.get(all);
            });
        },
        preview: function(payload) {
            var state = this.models.state;
            D.assign(state.data || {}, payload);
            state.changed();
        },
    }
};

exports.beforeRender = function() {
    var me = this;
    me.dispatch('init', { id: this.renderOptions.id });
};

