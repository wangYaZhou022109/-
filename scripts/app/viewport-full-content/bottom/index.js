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
            homeConfig.params = { configId: payload.configId || '', orgId: payload.orgId || '' };
            homeConfig.clear();
            return this.get(homeConfig).then(function() {
                if (homeConfig.data) {
                    bottom.params.homeConfigId = homeConfig.data.id;
                    bottom.clear();
                    return me.get(bottom);
                }
                return null;
            });
        }
    }
};
exports.beforeRender = function() {
    var payload = {};
    if (document.cookie) {
        document.cookie.split(';').forEach(function(item) {
            var arr = item.split('=');
            if (arr[1] !== 'undefined') {
                payload[arr[0]] = arr[1];
            }
        });
    }
    this.dispatch('init', payload);
};
