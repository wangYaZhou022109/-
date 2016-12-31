var remoteBackGround = 'http://img.zcool.cn/community/0192475847b9d3a8012060c82f4741.gif';

exports.bindings = {
    exam: true,
    down: true
};

exports.type = 'dynamic';

exports.getEntity = function() {
    return {
        endTime: this.bindings.exam.data.startTime
    };
};

exports.getEntityModuleName = function() {
    return 'exam/answer-paper/count-down';
};

exports.dataForEntityModule = function(data) {
    var me = this;
    return {
        data: data,
        callback: function() {
            return me.module.dispatch('init', { id: me.module.renderOptions.id });
        }
    };
};


exports.events = {
    'click signup': 'signup',
    'click revoke': 'revoke'
};

exports.handlers = {
    signup: function() {
        var me = this;
        return me.module.dispatch('signUp').then(function() {
            return me.module.dispatch('init', { id: me.module.renderOptions.id });
        });
    },
    revoke: function() {
        var me = this;
        return me.module.dispatch('revoke');
    }
};

exports.dataForTemplate = {
    handlerBtn: function() {
        var exam = this.bindings.exam.data,
            currentTime = new Date().getTime(),
            result = '';
        if (exam.type && exam.type === 1) {
            if (!exam.signUp || !exam.signUp.status) {
                result = 'signup';
            } else if (currentTime >= exam.startTime && currentTime < exam.endTime) {
                if (exam.isShowAnswerImmed === 1 && exam.examRecord && exam.examRecord.status > 5) {
                    result = 'detail';
                } else if (exam.examRecord && exam.examRecord.status > 4) {
                    result = 'overExam';
                } else {
                    result = 'startExam';
                }
            } else if (currentTime > exam.endTime) {
                result = 'detail';
            } else if (exam.type === 1 && exam.signUp.status === 1) {
                result = 'waitReview';
            } else if (exam.type === 1 && exam.signUp.status === 3) {
                result = 'rejected';
            } else {
                result = 'prepare';
            }
        } else if (exam.type && exam.type !== 1) {
            if (currentTime >= exam.startTime && currentTime < exam.endTime) {
                if (exam.isShowAnswerImmed === 1 && exam.examRecord && exam.examRecord.status > 5) {
                    result = 'detail';
                } else if (exam.examRecord && exam.examRecord.status > 4) {
                    result = 'overExam';
                } else {
                    result = 'startExam';
                }
            } else if (currentTime > exam.endTime) {
                result = 'detail';
            } else {
                result = 'prepare';
            }
        }

        return result;
    },
    examCoverUrl: function() {
        if (this.bindings.exam.data.coverId) {
            return this.bindings.down.getFullUrl() + '?id=' + this.bindings.exam.data.coverId;
        }
        return remoteBackGround;
    }
};
