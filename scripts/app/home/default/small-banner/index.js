exports.items = {
    'min-banner': 'min-banner'
};

exports.store = {
    models: {
        smallBanners: { url: '../system/home-advertisement' }
    },
    callbacks: {
        init: function(payload) {
            var smallBanners = this.models.smallBanners;
            smallBanners.clear();
            smallBanners.params.moduleHomeConfigId = payload.id;
            smallBanners.params.clientType = 1;
            return this.get(smallBanners);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.moduleHomeConfig);
};
