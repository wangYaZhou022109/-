exports.items = {
    pdf: 'pdf'
};

exports.store = {
    models: {
        download: { url: '../human/file/preview' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state;
            state.set(payload);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
