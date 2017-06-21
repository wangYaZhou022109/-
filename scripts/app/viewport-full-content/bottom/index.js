exports.items = {
    bottom: 'bottom'
};

exports.store = {
    models: {
        bottom: { url: '../system/home-footer' },
        homeConfig: { url: '../system/home-config/config' },
        announcements: { url: '../system/operation/announcement/person-list' } // 公告
    },
    callbacks: {
        init: function(payload) {
            var homeConfig = this.models.homeConfig,
                bottom = this.models.bottom,
                announcements = this.models.announcements,
                me = this;
            homeConfig.params = { configId: payload.configId || '', orgId: payload.orgId || '' };
            homeConfig.clear();
            if (this.app.global.currentUser.id) {
                announcements.clear();
                announcements.params = { page: 1, pageSize: 1 };
                this.get(announcements);
            }
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
        document.cookie.split('; ').forEach(function(item) {
            var arr = item.split('=');
            if (arr[1] !== 'undefined' || arr[1] !== '') {
                payload[arr[0]] = arr[1];
            }
        });
    }
    this.dispatch('init', payload);
};
