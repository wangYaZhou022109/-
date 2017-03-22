exports.items = {
    shareaudit: 'shareaudit'
};
exports.store = {
    models: {
        state: {},
        params: { data: { isOverdue: '1' } },
        shareaudit: { url: '../ask-bar/questionReviewed' },
        pass: { url: '../ask-bar/pending-audit/pass' },
        out: { url: '../ask-bar/pending-audit/out' },
    },
    callbacks: {
        init: function(paylaod) {
            var shareaudit = this.models.shareaudit;
            shareaudit.set({ id: paylaod.id });
            return this.get(shareaudit);
        },
        pass: function(payload) {
            this.models.pass.clear();           // 审核通过
            this.models.pass.set(payload);
            return this.put(this.models.pass);
        },
        out: function(payload) {
            this.models.out.clear();           // 审核拒绝
            this.models.out.set(payload);
            return this.put(this.models.out);
        },
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
exports.title = '分享审核';
exports.buttons = [{
    text: '拒绝',
    fn: function(data) {
        var params = data;
        params.auditStatus = 2;
        params.auditType = 12;
        return this.dispatch('out', params);
    }
}, {
    text: '通过',
    fn: function(data) {
        var params = data;
        params.auditStatus = 1;
        params.auditType = 12;
        return this.dispatch('pass', params);
    }
}];
