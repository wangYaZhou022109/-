var strings = require('./app/util/strings'),
    title = { add: '新增维度', edit: '编辑维度' },
    D = require('drizzlejs');

exports.items = {
    main: 'main'
};

exports.title = function() {
    return title[this.renderOptions.titleType];
};

exports.store = {
    models: {
        dimension: { url: '../exam/dimension' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                dimension = this.models.dimension;

            state.set(payload.data);
            state.callback = payload.callback;
            if (payload.data.id) {
                dimension.set({ id: payload.data.id });
                return this.get(dimension).then(function() {
                    state.data.order = dimension.data.order;
                });
            }
            return '';
        },
        save: function(payload) {
            var me = this,
                state = this.models.state;
            this.models.dimension.set(D.assign(payload, this.models.state.data));
            return this.save(this.models.dimension).then(function() {
                me.app.message.success('操作成功！');
                state.callback(me.models.dimension.data);
                me.models.dimension.clear();
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.buttons = [{
    text: function() {
        return strings.get('ok');
    },
    fn: function(payload) {
        var me = this;
        if (!me.items.main.validate()) {
            return false;
        }
        return this.dispatch('save', payload);
    }
}];

