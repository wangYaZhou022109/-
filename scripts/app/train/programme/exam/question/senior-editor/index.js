exports.items = {
    main: 'main',
    modal: ''
};

exports.store = {
    models: {
        img: { url: '../system/file/upload' },
        state: { data: {} }
    }
};

exports.beforeRender = function() {
    this.store.models.state.set(this.renderOptions.data);
};
