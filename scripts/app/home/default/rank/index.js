exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        moduleHomeConfig: {}
    },
    callbacks: {
        init: function(payload) {
            this.models.moduleHomeConfig.set(payload);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.moduleHomeConfig);
};
