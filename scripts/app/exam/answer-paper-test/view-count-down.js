var getEndTime;

exports.bindings = {
    exam: false,
    countDown: true
};

exports.type = 'dynamic';

exports.getEntity = function() {
    var data = this.bindings.exam.data;
    return {
        endTime: getEndTime.call(this, data.endTime, data.duration),
        isDeday: this.bindings.countDown.data.isDeday
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
    var nowTime = new Date(),
        countDown = this.bindings.countDown.data,
        endTime;
    if (!countDown.endTime) {
        nowTime.setMinutes(nowTime.getMinutes() + duration, nowTime.getSeconds(), 0);
        if (nowTime.getTime() > examActivityEndTime) {
            endTime = examActivityEndTime;
        }
        endTime = nowTime;
        countDown.endTime = endTime;
        countDown.isDeday = false;
        this.bindings.countDown.data = countDown;
    } else {
        countDown.endTime.setMinutes(
            countDown.endTime.getMinutes() + countDown.delay,
            countDown.endTime.getSeconds(),
            0
        );
        endTime = countDown.endTime;
        this.bindings.countDown.data.isDeday = true;
    }
    return endTime;
};
