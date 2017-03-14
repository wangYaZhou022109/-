exports.type = 'form';

exports.bindings = {
    auditAll: true,
    state: false
};

exports.actions = {
    'click auditAllTrainees': 'auditAllTrainees'
};

exports.actionCallbacks = {
    auditAllTrainees: function(data) {
        var success = data[0][0];
        var fail = data[0][1];
        var state = this.bindings.state.data;
        if (success === 0) {
            this.app.message.error('配额已满！');
        } else {
            this.app.message.success('审核成功' + success + '条，失败' + fail + '条。');
        }
        this.app.viewport.closeModal();
        this.module.dispatch('init', state);
    }
};
