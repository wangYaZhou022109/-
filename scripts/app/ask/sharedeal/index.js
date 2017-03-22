exports.items = {
    shareaudit: 'shareaudit'
};
exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        shareaudit: { url: '../ask-bar/questionReviewed' }
    },
    callbacks: {
        init: function(paylaod) {
            var shareaudit = this.models.shareaudit;
            shareaudit.set({ id: paylaod.id });
            return this.get(shareaudit);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
