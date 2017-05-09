exports.items = {
    pannel: 'pannel'
};

exports.store = {
    models: {
        region: {},
        subject: {},
        state: {}
    },
    callbacks: {
        init: function(options) {
            this.models.region.set(options.region);
            this.models.subject.set(options.subject);
            this.models.state.set(options.state);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
