exports.items = {
    main: 'main',
    'picker/topics/select-topic': { isModule: true }
};

exports.store = {
    models: {
        state: {},
        hot: { url: '../system/topic/hot', autoLoad: 'after', params: { type: 4, limit: 5 } },
    }
};

exports.mixin = {
    getValue: function() {
        return this.items.main.components.tags.getValue();
    },
    getData: function() {
        return this.items.main.components.tags.getData();
    },
    validate: function() {
        return this.items.main.validate();
    }
};
exports.beforeRender = function() {
    this.store.models.state.data = this.renderOptions;
};
