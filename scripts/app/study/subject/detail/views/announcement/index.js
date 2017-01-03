exports.items = {
    pannel: 'pannel'
};

exports.store = {
    models: {
        region: {}
    }
};

exports.beforeRender = function() {
    this.store.models.region.set(this.renderOptions.region);
};
