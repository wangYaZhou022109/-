exports.items = {
    main: 'main',
    'picker/members/select-member': { isModule: true }
};

exports.store = {
    models: {
        state: {}
    }
};

exports.mixin = {
    getValue: function() {
        return this.items.main.components.tags.getValue();
    }
};
exports.beforeRender = function() {
    this.store.models.state.data = this.renderOptions;
};
