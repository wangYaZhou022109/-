var validators = require('./app/ext/views/form/validators');

exports.bindings = {
    state: false
};

exports.small = true;

exports.buttons = [{
    text: '确认',
    action: 'auditTrainee'
}];

exports.dataForActions = {
    auditTrainee: function(payload) {
        var auditStatus = payload.auditStatus || '',
            auditOpinion = payload.auditOpinion || '',
            id = payload.id || '';
        if (!validators.required.fn(auditStatus)) {
            this.app.message.error('请选择审核状态');
            return false;
        }
        if (!validators.required.fn(auditOpinion)) {
            this.app.message.error('请填写审核意见');
            return false;
        }
        if (!validators.required.fn(id)) {
            return false;
        }
        return payload;
    }
};

exports.actionCallbacks = {
    auditTrainee: function(data) {
        var success = data[0][0];
        var fail = data[0][1];
        var state = this.bindings.state.data;
        if (success === 0) {
            this.app.message.error('配额已满！');
        } else if (fail === 0) {
            this.app.message.success('审核成功!');
        } else {
            this.app.message.success('审核成功' + success + '条!');
            this.app.message.error('审核失败' + fail + '条!');
        }
        this.module.dispatch('init', state);
    }
};

exports.dataForTemplate = {
    traineeId: function() {
        return this.renderOptions.traineeId;
    }
};
