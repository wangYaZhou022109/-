exports.items = {
    pannel: 'pannel'
};

exports.store = {
    models: {
        region: {},
        subject: {}
    }
};

exports.beforeRender = function() {
    this.store.models.region.set(this.renderOptions.region);
    this.store.models.subject.set(this.renderOptions.subject);
};
