exports.bindings = {
    state: false
};

exports.type = 'dynamic';

exports.getEntity = function() {
    return this.bindings.state.data.duration;
};

exports.getEntityModuleName = function() {
    return 'exam/paper/answer-paper/count-down';
};

exports.dataForEntityModule = function(data) {
    var me = this;
    return {
        duration: data,
        callback: function() {
            me.app.viewport.modal(me.module.items.tips, { message: '交卷时间到' });
        }
    };
};
