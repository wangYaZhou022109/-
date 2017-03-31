module.exports = {
    items: {
        main: 'main'
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
                var configId = payload.configId,
                    orgId = payload.orgId,
                    that = this,
                    homeConfig = this.models.homeConfig,
                    modules = this.models.modules;
                homeConfig.params = { id: configId, orgId: orgId };
                homeConfig.clear();
                return this.get(homeConfig).then(function() {
                    if (homeConfig.data) {
                        modules.params.homeConfigId = homeConfig.data.id;
                        return that.get(modules);
                    }
                    return null;
                });
            }
        }
    }
};
