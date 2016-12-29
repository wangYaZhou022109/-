exports.items = {
    pannel: 'pannel',
    pdf: ''
};

exports.store = {
    models: {
        region: {},
        subject: {},
        down: {
            url: '../human/file/download'
        },
        attachment: {}
    }
};

exports.beforeRender = function() {
    this.store.models.region.set(this.renderOptions.region);
    this.store.models.subject.set(this.renderOptions.subject);
};
