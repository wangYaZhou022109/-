exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        researchActivity: { url: '../exam/research-activity/simple-data' }
    },
    callbacks: {
        init: function(payload) {
            var model = this.models.researchActivity;
            model.set({ id: payload.section.resourceId });
            return this.get(model);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
