var remoteBackGround = 'images/default-cover/default_exam.jpg';

exports.bindings = {
    exam: true,
    down: true,
    certificate: true
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
        return me.module.dispatch('revoke').then(function() {
            me.module.dispatch('removeSingUp');
        });
    }
};

exports.dataForTemplate = {
    totalScore: function() {
        var exam = this.bindings.exam.data;
        if (exam && exam.paperClass && exam.paperClass.totalScore) {
            return exam.paperClass.totalScore / 100;
        }
        return '';
    },
    joinNumber: function() {
        var exam = this.bindings.exam.data;
        return exam.joinNumber || 0;
    },
    handlerBtn: function() {
        var exam = this.bindings.exam.data,
            currentTime = new Date().getTime(),
            result = '';
        if (exam.type) {
            if (exam.type === 1 && currentTime < exam.applicantEndTime) {
                if ((!exam.signUp || !exam.signUp.status)) {
                    result = 'signup';
                    return result;
                } else if (exam.applicantNeedAudit === 1 && exam.signUp.status === 1) {
                    result = 'waitReview';
                    return result;
                } else if (exam.applicantNeedAudit === 1 && exam.signUp.status === 3) {
                    result = 'rejected';
                    return result;
                } else if (currentTime < exam.startTime) {
                    result = 'revoke';
                }
            } else if (exam.type === 1 && currentTime >= exam.applicantEndTime && currentTime < exam.endTime) {
                if ((!exam.signUp || !exam.signUp.status)) {
                    result = 'signupEnd';
                    return result;
                } else if (exam.applicantNeedAudit === 1 && exam.signUp.status === 1) {
                    result = 'waitReview';
                    return result;
                } else if (exam.applicantNeedAudit === 1 && exam.signUp.status === 3) {
                    result = 'rejected';
                    return result;
                }
            }
            if (currentTime >= exam.startTime && currentTime < exam.endTime) {
                if (exam.isShowAnswerImmed === 1 && exam.examRecord && exam.examRecord.status > 5) {
                    if (exam.remainTimes > 0 || exam.allowExamTimes === 0) {
                        result = 'submittedShowDetail';
                    } else {
                        result = 'detail';
                    }
                } else if (exam.examRecord && exam.examRecord.status > 4) {
                    result = 'submitted';
                } else {
                    result = 'startExam';
                }
            } else if (currentTime > exam.endTime) {
                if (exam.examRecord && exam.examRecord.status > 5) {
                    result = 'detail';
                } else {
                    result = 'end';
                }
            } else if (currentTime < exam.startTime) {
                result = 'noBegin';
            }
        }
        return result;
    },
    examCoverUrl: function() {
        if (this.bindings.exam.data.coverId) {
            return this.bindings.down.getFullUrl() + '?id=' + this.bindings.exam.data.coverId;
        }
        return remoteBackGround;
    },
    isNoLimitTime: function() {
        return this.bindings.exam.data.allowExamTimes === 0;
    }
};
