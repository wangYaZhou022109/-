exports.items = {
    main: 'main',
    count: 'count',
    approval: '',
};

exports.large = true;

exports.store = {
    models: {
        leave: {
            url: '../train/leave/leave',
            type: 'pageable',
            root: 'items'
        },
        lea: {
            url: '../train/leave'
        },
        signOne: {
            url: '../train/leave/one'
        },
        updateState: {
            url: '../train/leave/update'
        },
        state: { data: {} },
    },
    callbacks: {
        init: function(payload) {
            var leave = this.models.leave,
                signOne = this.models.signOne;
            leave.params = payload;
            leave.set({ id: payload.id });
            signOne.params.id = payload.id;
            signOne.clear();
            this.get(signOne);
            return this.get(leave);
        },
        search: function(payload) {
            var leave = this.models.leave,
                id = this.models.state.data.id;
            leave.params = payload;
            leave.params.id = id;
            return this.get(leave);
        },
        refreshList: function(options) {
            var model = this.models.leave;
            model.clear();
            model.params = options;
            this.get(model);
        },
        approval: function(payload) {
            var lea = this.models.lea;
            lea.params = payload;
            lea.clear();
            return this.get(lea);
        },
        update: function(payload) {
            var updateState = this.models.updateState,
                leave = this.models.leave,
                me = this;
            updateState.params = payload;
            updateState.set(payload);
            me.put(updateState).then(function() {
                me.app.message.success('修改成功');
                me.get(leave);
            });
        },
    }
};

exports.beforeRender = function() {
    var data = this.store.models.state.data;
    data.id = this.renderOptions.id;
    this.dispatch('init', { id: this.renderOptions.id });
};
