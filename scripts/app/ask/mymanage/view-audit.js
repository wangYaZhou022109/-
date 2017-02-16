exports.title = '内容审核';

exports.type = 'form';

exports.bindings = {
    audit: true,
    download: false
};

exports.buttons = [{
    text: '通过',
    action: 'pass'
}, {
    text: '拒绝',
    action: 'out'
}];

exports.events = {
    'click preview*': 'preview'
};

exports.dataForActions = {
    pass: function(payload) {
        var data = payload;
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
