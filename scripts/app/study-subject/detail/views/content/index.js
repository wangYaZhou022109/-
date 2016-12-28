exports.items = {
    pannel: 'pannel'
};

exports.store = {
    models: {
        region: {},
        subject: {},
        state: {}
    }
};

exports.beforeRender = function() {
    this.store.models.region.set(this.renderOptions.region);
    this.store.models.subject.set(this.renderOptions.subject);
    this.store.models.state.set(this.renderOptions.state);
};
