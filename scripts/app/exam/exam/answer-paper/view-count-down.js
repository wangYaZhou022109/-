var strings = require('./app/util/strings');

exports.bindings = {
    exam: false,
    examRecord: false,
    countDown: true
};

exports.type = 'dynamic';

exports.getEntity = function() {
    var exam = this.bindings.exam.data,
        countDown = this.bindings.countDown.data,
        delay = countDown.delay;
    return {
        endTime: exam.examRecord.endTime,
        startTime: exam.examRecord.currentTime,
        isDelay: countDown.isDeday,
        delay: delay
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
        }],
        resetDelay: function() {
            return me.module.dispatch('resetDelay');
        }
    };
};
