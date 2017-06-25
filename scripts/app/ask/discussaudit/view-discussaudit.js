var _ = require('lodash');
exports.bindings = {
    discussaudit: true,
    down: false,
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
            auditType = this.bindings.discussaudit.data.auditType;
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
    discussaudit: function(data) {
        var discussaudit = data.discussaudit;
        return discussaudit;
    },
    headPhoto: function(data) {
        var discussaudit = data.discussaudit,
            headPhoto = 'images/default-userpic.png';
        if (!_.isEmpty(discussaudit)) {
            headPhoto = this.bindings.down.getFullUrl() + '?id=' + discussaudit.member.headPortrait;
        }
        return headPhoto;
    },
};
