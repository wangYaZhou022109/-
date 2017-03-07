
exports.bindings = {
    state: true
};


exports.actions = {
    'click report*': 'report'
};

exports.dataForActions = {
    report: function(payload) {
        return payload;
    }
};

exports.actionCallbacks = {
    report: function() {
        this.app.message.success('操作成功！');
        this.module.dispatch('close');
    }
};
