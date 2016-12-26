exports.bindings = {
    state: false,
    exam: false
};

exports.type = 'dynamic';

exports.getEntity = function() {
    return {
        endTime: this.bindings.exam.data.endTime,
        duration: this.bindings.exam.data.duration
    };
};

exports.getEntityModuleName = function() {
    return 'exam/paper/answer-paper/count-down';
};

exports.dataForEntityModule = function(data) {
    var me = this;
    return {
        data: data,
        callback: function() {
            me.app.viewport.modal(me.module.items.tips, { message: '交卷时间到' });
        }
    };
};
