exports.items = {
    shareaudit: 'shareaudit'
};
exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        shareaudit: { url: '../ask-bar/questionReviewed' },
        pass: { url: '../ask-bar/pendingAudit/pass' },
        out: { url: '../ask-bar/pendingAudit/out' },
    },
    callbacks: {
        init: function(paylaod) {
            var shareaudit = this.models.shareaudit;
            shareaudit.set({ id: paylaod.id });
            return this.get(shareaudit);
        },
        pass: function(payload) {           // 审核通过
            this.models.pass.set(payload);
            return this.put(this.models.pass);
        },
        out: function(payload) {           // 审核拒绝
            this.models.pass.set(payload);
            return this.put(this.models.out);
        },
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
