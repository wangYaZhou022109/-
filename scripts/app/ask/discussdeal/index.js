
exports.items = {
    discussaudit: 'discussaudit'
};
exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        discussaudit: { url: '../ask-bar/pending-audit/discuss' },
        pass: { url: '../ask-bar/pending-audit/pass' },
        out: { url: '../ask-bar/pending-audit/out' },
        down: { url: '../human/file/download' },
    },
    callbacks: {
        init: function(paylaod) {
            var discussaudit = this.models.discussaudit;
            discussaudit.set({ id: paylaod.id });
            return this.get(discussaudit);
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
