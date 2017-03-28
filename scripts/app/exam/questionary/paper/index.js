exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        research: {
            url: '../exam/research-record/research'
        }
    },
    callbacks: {
        init: function(payload) {
            if (payload.researchId) {
                this.models.research.params = { researchId: payload.researchId };
                return this.get(this.models.research);
            }
            return '';
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
