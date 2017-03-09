var D = require('drizzlejs'),
    getEndTime;

exports.bindings = {
    exam: false,
    countDown: true
};

exports.type = 'dynamic';

exports.getEntity = function() {
    var data = this.bindings.exam.data;
    return {
        endTime: getEndTime.call(this, data.endTime, data.duration),
        isDelay: this.bindings.countDown.data.isDeday
    };
};

exports.getEntityModuleName = function() {
    return 'exam/exam/answer-paper-2/count-down';
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
        data = this.bindings.countDown.data,
        endTime;

    if (!data.firstInTime) {
        data.firstInTime = new Date(nowTime).getTime();
        nowTime.setMinutes(nowTime.getMinutes() + duration, nowTime.getSeconds(), 0);
        if (nowTime.getTime() > examActivityEndTime) {
            data.endTime = examActivityEndTime;
        }
        data.endTime = new Date(nowTime).getTime();
        data.isDeday = false;
        this.bindings.countDown.data = data;
    }

    if (data.delay) {
        endTime = new Date(data.endTime);
        endTime.setMinutes(
            endTime.getMinutes() + data.delay,
            endTime.getSeconds(),
            0
        );
        D.assign(this.bindings.countDown.data, {
            endTime: endTime.getTime(),
            isDeday: true
        });
    }
    data.delay = 0;

    this.bindings.countDown.save();
    return new Date(data.endTime);
};
