exports.items = {
    'banner-notice': 'banner-notice'
};

exports.store = {
    models: {
        personPanels: {
            url: '../system/person-panel'
        }
    },
    callbacks: {
        init: function(payload) {
            var personPanels = this.models.personPanels;
            personPanels.params.moduleConfigId = payload.id;
            return this.get(personPanels);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', this.renderOptions.moduleHomeConfig);
};
