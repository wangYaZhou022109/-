exports.items = {
    pannel: 'pannel'
};

exports.store = {
    models: {
        photos: {},
        state: {
            data: {
                index: 0
            }
        }
    },
    callbacks: {
        init: function(options) {
            this.models.photos.set(options.photos);
            this.models.state.set({
                index: options.index
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
