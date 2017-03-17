exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        knowledge: {},
        download: { url: '../human/file/download' }
    }
};
exports.beforeRender = function() {
    this.store.models.knowledge.set(this.renderOptions);
};
