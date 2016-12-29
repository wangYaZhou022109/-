module.exports = {
    items: { ranklist: 'ranklist' },
    beforeRender: function() {
        this.dispatch('init', this.renderOptions);
    },
    store: {
        models: {
            homeConfig: {}
        },
        callbacks: {
            init: function(mod) {
                this.models.homeConfig = mod;
            }
        }
    }
};
