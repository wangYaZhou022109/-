exports.items = {
    audit: 'audit'
};
exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        audit: { url: '../ask-bar/questionReviewed' },
        pass: { url: '../ask-bar/pendingAudit/pass' },
        out: { url: '../ask-bar/pendingAudit/out' },
    },
    callbacks: {
        init: function(paylaod) {
            var audit = this.models.audit;
            audit.set({ id: paylaod.id });
            return this.get(audit);
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
