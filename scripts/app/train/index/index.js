exports.items = {
    top: 'top',
    main: 'main'
};

exports.store = {
    models: {
        projectInfo: { url: '../train/projectInfo' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state;
            state.data.menu = 'book';
            state.data.book = true;
            state.data.id = payload.id;
            state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
