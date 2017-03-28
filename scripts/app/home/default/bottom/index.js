exports.items = {
    bottom: 'bottom'
};

exports.store = {
    models: {
        bottom: { url: '../system/home-footer' },
        homeConfig: { url: '../system/home-config/config' }
    },
    callbacks: {
        init: function(payload) {
            var homeConfig = this.models.homeConfig,
                bottom = this.models.bottom,
                me = this;
            if (payload.configId) {
                homeConfig.params = { id: payload.configId };
            }
            return this.get(homeConfig).then(function() {
                if (homeConfig.data) {
                    bottom.params.homeConfigId = homeConfig.data.id;
                    return me.get(bottom);
                }
                return null;
            });
        }
    }
};
exports.beforeRender = function() {
    var params = {};
    window.location.search.substr(1).split('&').forEach(function(kv) {
        var kvarr = kv.split('=');
        params[kvarr[0]] = kvarr[1];
    });
    this.dispatch('init', params);
};
