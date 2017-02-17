exports.items = {
    reportaudit: 'reportaudit'
};
exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        reportaudit: { url: '../ask-bar/pendingAudit/accuseRecord' },
        pass: { url: '../ask-bar/pendingAudit/pass' },
        out: { url: '../ask-bar/pendingAudit/out' },
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
