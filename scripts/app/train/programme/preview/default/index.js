exports.items = {
    default: 'default'
};

exports.store = {
    models: {
        state: {}
    }
};

exports.beforeRender = function() {
    this.store.models.state.set(this.renderOptions.state);
};
