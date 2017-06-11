exports.items = {
    main: 'main',
    'home/default/more/rank/rank-integral': { isModule: true }
};
exports.store = {
    models: {
        integralRank: { url: '../system/integral-result/rank-integral-total' }
    },
    callbacks: {
        init: function(payload) {
            var integralRank = this.models.integralRank;
            integralRank.clear();
            integralRank.params.size = payload.size || 10;
            if (this.app.global.currentUser.id) {
                if (payload.dataSource !== '' && (payload.dataSource === '1' || payload.dataSource === 1)) {
                    integralRank.params.organizationId = this.app.global.currentUser.organization.id;
                } else {
                    integralRank.params.organizationId = this.app.global.currentUser.rootOrganization.id;
                }
            }
            return this.get(integralRank);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', this.renderOptions.rankModule);
};
