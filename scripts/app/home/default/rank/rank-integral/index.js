exports.items = {
    main: 'main'
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
            return this.get(integralRank);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', { size: 10 });
};
