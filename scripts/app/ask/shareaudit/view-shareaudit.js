
exports.bindings = {
    shareaudit: true
};
exports.events = {
};
exports.actions = {
    'click pass': 'pass',
    'click out': 'out',
};
exports.dataForActions = {
    pass: function(payload) {
        var data = payload,
            auditType = this.bindings.shareaudit.data.auditType;
        data.auditType = auditType;
        data.auditStatus = 1;
        return data;
    },
    out: function(payload) {
        var data = payload;
        data.auditStatus = 2;
        return data;
    }
};

exports.actionCallbacks = {
    pass: function() {
        this.app.message.success('完成审核！');
    },
    out: function() {
        this.app.message.success('完成审核！');
    }
};
exports.dataForTemplate = {
    shareaudit: function(data) {
        var shareaudit = data.shareaudit;
        return shareaudit;
    }

};