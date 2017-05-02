exports.items = {
    reportaudit: 'reportaudit'
};
exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        reportaudit: { url: '../ask-bar/pending-audit/accuseRecord' },
        pass: { url: '../ask-bar/pending-audit/pass' },
        out: { url: '../ask-bar/pending-audit/out' },
    },
    callbacks: {
        init: function(paylaod) {
            var reportaudit = this.models.reportaudit;
            reportaudit.set({ id: paylaod.id });
            return this.get(reportaudit);
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
exports.title = '举报审核';
exports.buttons = [{
    text: '拒绝',
    fn: function(data) {
        var params = data;
        params.auditStatus = 2;
        params.auditType = 4;
        return this.dispatch('out', params);
    }
}, {
    text: '通过',
    fn: function(data) {
        var params = data;
        params.auditStatus = 1;
        params.auditType = 4;
        return this.dispatch('pass', params);
    }
}];
