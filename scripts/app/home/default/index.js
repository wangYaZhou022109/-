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
        'home/default/banner': { region: 'banner', isModule: true },
        'home/default/news': { region: 'news', isModule: true },
        main: 'main'
        // 'home/default/online-course': { region: 'online-course', isModule: true },
        // 'home/default/study-subject': { region: 'study-subject', isModule: true },
        // 'home/default/recommend-activity': { region: 'recommend-activity', isModule: true },
        // 'home/default/lecture': { region: 'lecture', isModule: true },
        // 'home/default/ranking': { region: 'ranklist', isModule: true }
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
                if (configId) {
                    return this.module.dispatch('loadModules', configId);
                }
                return this.get(homeConfig).then(function() {
                    var cfgId = homeConfig.data.id;
                    return that.module.dispatch('loadModules', cfgId);
                });
            }
        }
    }
};
