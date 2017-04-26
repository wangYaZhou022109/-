module.exports = {
    items: {
        advertising: 'advertising'
    },
    afterRender: function() {
        this.dispatch('init', this.renderOptions.moduleHomeConfig);
    },
    store: {
        models: {
            adverts: {
                url: '../system/home-advertisement'
            },
            down: {
                url: '../human/file/download'
            }
        },
        callbacks: {
            init: function(payload) {
                var adverts = this.models.adverts;
                adverts.clear();
                adverts.params.moduleHomeConfigId = payload.id;
                adverts.params.clientType = 1;
                return this.get(adverts);
            }
        }
    }
};
