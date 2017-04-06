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
            homeConfig.params = { id: payload.configId, orgId: payload.orgId };
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
    this.dispatch('init', this.renderOptions || {});
};
