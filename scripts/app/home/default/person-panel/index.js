exports.items = {
    'banner-notice': 'banner-notice'
};

exports.store = {
    models: {
        personPanels: {
            url: '../system/person-panel'
        },
        newsList: {
            url: '../system/home-news/person-panel'
        }
    },
    callbacks: {
        init: function(payload) {
            var personPanels = this.models.personPanels,
                newsList = this.models.newsList;
            personPanels.params.moduleConfigId = payload.id;
            newsList.params.configId = payload.homeConfigId;
            newsList.params.size = 5;
            personPanels.clear();
            newsList.clear();
            return this.chain(
                this.get(personPanels),
                this.get(newsList)
            );
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', this.renderOptions.moduleHomeConfig);
};
