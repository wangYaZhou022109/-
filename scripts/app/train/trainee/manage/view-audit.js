exports.type = 'form';

exports.bindings = {
    auditTrainee: true,
    state: false
};

exports.actions = {
    'click auditTrainee': 'auditTrainee'
};

exports.actionCallbacks = {
    auditTrainee: function(data) {
        var state = this.bindings.state.data;
        if (data[0]) {
            this.app.message.success('审核成功！');
        } else {
            this.app.message.error('配额已满！');
        }
        this.app.viewport.closeModal();
        this.module.dispatch('init', state);
    }
};
