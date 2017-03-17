exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        knowledge: {},
        download: { url: '../human/file/preview' }
    }
};
exports.beforeRender = function() {
    this.store.models.knowledge.set(this.renderOptions);
};
