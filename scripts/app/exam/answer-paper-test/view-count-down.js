var getEndTime;

exports.bindings = {
    exam: false,
};

exports.type = 'dynamic';

exports.getEntity = function() {
    var data = this.bindings.exam.data;
    return {
        endTime: getEndTime(data.endTime, data.duration),
        duration: data.duration
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

getEndTime = function(examActivityEndTime, duration) {
    var nowTime = new Date();
    nowTime.setMinutes(nowTime.getMinutes() + duration, nowTime.getSeconds(), 0);
    if (nowTime.getTime() > examActivityEndTime) return examActivityEndTime;
    return nowTime;
};
