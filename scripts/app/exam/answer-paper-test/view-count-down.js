
exports.bindings = {
    exam: false,
};

exports.type = 'dynamic';

exports.getEntity = function() {
    return {
        endTime: this.bindings.exam.data.endTime,
        duration: this.bindings.exam.data.duration
    };
};

exports.getEntityModuleName = function() {
    return 'exam/answer-paper-test/count-down';
};

exports.dataForEntityModule = function(data) {
    var me = this;
    return {
        data: data,
        callback: function() {
            me.app.message.success('交卷时间到,你本次考试已被强制交卷');
            me.module.dispatch('submit', { submitType: 'Hand' });
            me.app.viewport.modal(me.module.items.tips, { message: '交卷时间到,你本次考试已被强制交卷' });
        }
    };
};
