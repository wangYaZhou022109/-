module.exports = {
    items: {
        main: 'main',
        'first-login': 'first-login'
    },
    afterRender: function() {
        this.dispatch('init', this.renderOptions || {});
    },
    store: {
        models: {
            modules: { url: '../system/home-module' },
            homeConfig: { url: '../system/home-config/config' }
        },
        callbacks: {
            init: function(payload) {
                var that = this,
                    homeConfig = this.models.homeConfig,
                    modules = this.models.modules;
                homeConfig.params = { configId: payload.configId, orgId: payload.orgId };
                homeConfig.clear();
                return this.get(homeConfig).then(function() {
                    if (homeConfig.data) {
                        modules.params.homeConfigId = homeConfig.data.id;
                        modules.params.clientType = 1;
                        return that.get(modules);
                    }
                    return null;
                });
            }
        }
    }
};
