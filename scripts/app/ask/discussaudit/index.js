
exports.items = {
    discussaudit: 'discussaudit'
};
exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        discussaudit: { url: '../ask-bar/pending-audit/discuss' },
        pass: { url: '../ask-bar/pending-audit/pass' },
        out: { url: '../ask-bar/pending-audit/out' },
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
            this.models.out.set(payload);
            return this.put(this.models.out);
        },
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
exports.title = '讨论审核';
exports.buttons = [{
    text: '拒绝',
    fn: function(data) {
        var params = data;
        params.auditStatus = 2;
        params.auditType = 2;
        return this.dispatch('out', params);
    }
}, {
    text: '通过',
    fn: function(data) {
        var params = data;
        params.auditStatus = 1;
        params.auditType = 2;
        return this.dispatch('pass', params);
    }

}];
