function getParams () {
    var params = {};
    window.location.search.substr(1).split('&').forEach(function(kv) {
        var kvarr = kv.split('=');
        params[kvarr[0]] = kvarr[1];
    });
    return params;
}

module.exports = {
    items: {
        main: 'main'
    },
    beforeRender: function() {
        this.dispatch('init');
    },
    store: {
        models: {
            modules: { url: '../system/home-module' },
            homeConfig: { url: '../system/home-config/config' }
        },
        callbacks: {
            loadModules: function(cfgId) {
                var modules = this.models.modules;
                modules.params = {
                    homeConfigId: cfgId
                };
                return this.get(modules);
            },
            init: function() {
                var configId = getParams().configid,
                    that = this,
                    homeConfig = this.models.homeConfig;
                homeConfig.params = { id: configId };
                return this.get(homeConfig).then(function() {
                    var cfgId;
                    if (homeConfig.data) {
                        cfgId = homeConfig.data.id;
                        return that.module.dispatch('loadModules', cfgId);
                    }
                    return null;
                });
            }
        }
    }
};
