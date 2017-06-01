var D = require('drizzlejs'),
    strings = require('./app/util/strings'),
    getEndTime;

exports.bindings = {
    exam: false,
    countDown: false
};

exports.type = 'dynamic';

exports.getEntity = function() {
    var data = this.bindings.exam.data;
    return {
        endTime: getEndTime.call(this, data.examRecord.endTime),
        startTime: data.examRecord.startTime,
        isDelay: this.bindings.countDown.data.isDeday
    };
};

exports.getEntityModuleName = function() {
    return 'exam/exam/answer-paper/count-down';
};

exports.dataForEntityModule = function(data) {
    var me = this;
    return {
        data: data,
        callback: [{
            time: 0,
            doing: function() {
                return me.module.dispatch('submitPaper', { submitType: 'Hand' }).then(function() {
                    return me.module.dispatch('showTips', {
                        tips: strings.get('exam.answer-paper.time-out.submit')
                    }).then(function() {
                        me.app.viewport.modal(me.module.items['exam-notes']);
                    });
                });
            }
        }, {
            time: 1,
            doing: function() {
                me.app.message.success(strings.get('exam.answer-paper.remain-one-mins'));
            }
        }, {
            time: 5,
            doing: function() {
                me.app.message.success(strings.get('exam.answer-paper.remain-five-mins'));
            }
        }]
    };
};

getEndTime = function(examRecordEndTime) {
    var data = this.bindings.countDown.data,
        endTime;
    if (!data.firstInTime) {
        data.firstInTime = new Date().getTime();
        data.endTime = new Date(examRecordEndTime).getTime();
        data.isDeday = false;
        this.bindings.countDown.data = data;
    }

    if (data.delay) {
        endTime = new Date(examRecordEndTime);
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
