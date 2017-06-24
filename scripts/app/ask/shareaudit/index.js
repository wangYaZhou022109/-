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
        down: { url: '../human/file/download' },
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
exports.title = '文章审核';
exports.buttons = [{
    text: '拒绝',
    fn: function(data) {
        var params = data;
        var me = this;
        params.auditStatus = 2;
        params.auditType = 12;
        this.dispatch('out', params).then(function() {
            this.app.message.success('拒绝成功！');
            me.renderOptions.callback();
        });
    }
}, {
    text: '通过',
    fn: function(data) {
        var params = data;
        var me = this;
        params.auditStatus = 1;
        params.auditType = 12;
        this.dispatch('pass', params).then(function() {
            this.app.message.success('审核成功！');
            me.renderOptions.callback();
        });
    }
}];
