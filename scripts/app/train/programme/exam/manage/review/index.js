exports.items = {
    search: 'search',
    main: 'main'
};

exports.store = {
    models: {
        signups: {
            url: '../exam/sign-up',
            type: 'pageable',
            root: 'items'
        },
        signup: { url: '../exam/sign-up' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            this.models.state.set({ examId: payload.id });
            return this.module.dispatch('search', { status: payload.status });
        },
        search: function(payload) {
            var data = payload;
            if (Number(data.status) === 0) data.status = '';
            data.examId = this.models.state.data.examId;
            this.models.signups.params = data;
            return this.get(this.models.signups);
        },
        update: function(payload) {
            var me = this;
            this.models.signup.set(payload);
            return this.put(this.models.signup).then(function() {
                me.app.message.success('操作成功');
                me.get(me.models.signups);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id, status: 0 });
};
