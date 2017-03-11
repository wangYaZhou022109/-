exports.items = {
    main: 'main',
    'picker/topics/select-topic': { isModule: true }
};

exports.store = {
    models: {
        state: {}
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

