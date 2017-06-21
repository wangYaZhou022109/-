exports.title = '提问审核';

exports.items = {
    audit: 'audit'
};

exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        audit: { url: '../ask-bar/questionReviewed' },
        pass: { url: '../ask-bar/pending-audit/pass' },
        out: { url: '../ask-bar/pending-audit/out' },
    },
    callbacks: {
        init: function(paylaod) {
            var audit = this.models.audit;
            audit.set({ id: paylaod.id });
            return this.get(audit);
        }
    }
};

// exports.buttons = function() {
//     var auditStatus = this.store.models.audit.auditStatus;
//     console.log(this.store.models.audit);
//     if (auditStatus === 1) {
//         return [{
//             text: '已通过',
//             action: 'pass'
//         }];
//     }
//     return [{
//         text: '已拒绝',
//         action: 'refuse'
//     }];
// };

exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
