exports.type = 'form';

exports.bindings = {
    state: false
};

exports.small = true;

exports.buttons = [{
    text: '确认',
    fn: function(payload) {
        var me = this;
        if (me.validate()) {
            me.module.dispatch('auditTrainee', payload).then(function(data) {
                var success = data[0][0];
                var fail = data[0][1];
                var state = me.bindings.state.data;
                if (success === 0) {
                    me.app.message.error('配额已满！');
                } else if (fail === 0) {
                    me.app.message.success('审核成功!');
                } else {
                    me.app.message.success('审核成功' + success + '条!');
                    me.app.message.error('审核失败' + fail + '条!');
                }
                me.module.dispatch('init', state);
            });
        } else {
            me.app.message.error('审核状态必填！');
        }
    }
}];

exports.dataForTemplate = {
    traineeId: function() {
        return this.renderOptions.traineeId;
    }
};
