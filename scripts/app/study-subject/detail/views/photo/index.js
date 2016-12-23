exports.items = {
    pannel: 'pannel'
};

exports.store = {
    models: {
        region: {},
        subject: {},
        download: {
            url: '../human/file/download'
        }
    }
};

exports.beforeRender = function() {
    this.store.models.region.set(this.renderOptions.region);
    this.store.models.subject.set(this.renderOptions.subject);
};
