var _ = require('lodash/collection');
exports.bindings = {
    exams: true,
    search: false
};
exports.events = {
    'click cancel-button-*': 'cancel',
    'click signup-button-*': 'signup',
    'click to-exam-button-*': 'toExam',
    'click to-cert-button-*': 'toCert',
    'click to-detail-button-*': 'toDetail',
    'click retry-button-*': 'retry'
};

exports.handlers = {
    cancel: function(examId) {
        var me = this;
        me.module.dispatch('revoke', examId).then(function() {
            me.module.dispatch('refreshList');
        });
    },
    signup: function(examId) {
        var me = this;
        me.module.dispatch('signUp', examId).then(function() {
            me.module.dispatch('refreshList');
        });
    },
    toExam: function(examId) {
        var url = '#/exam/exam/answer-paper/' + examId;
        window.open(url, '_blank');
    },
    toCert: function(examId) {
        var url = '#/exam/exam/answer-paper/' + examId;
        window.open(url, '_blank');
    },
    toDetail: function(examId) {
        var url = '#/exam/exam/score-detail/' + examId;
        window.open(url, '_blank');
    },
    retry: function(examId) {
        var url = '#/exam/exam/answer-paper/' + examId;
        window.open(url, '_blank');
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'exams' }
}];

exports.dataForTemplate = {
    exams: function(data) {
        var exams = data.exams;
        _.map(exams, function(opt) {
            var exam = opt,
                currentTime = new Date().getTime(),
                cancelButton = { id: 'cancel-button-' + exam.id, text: '取消报名' },
                signupButton = { id: 'signup-button-' + exam.id, text: '我要报名' },
                toExamButton = { id: 'to-exam-button-' + exam.id, text: '进入考试' },
                toCertButton = { id: 'to-cert-button-' + exam.id, text: '查看证书' },
                toDetailButton = { id: 'to-detail-button-' + exam.examRecord.id, text: '查看详情' },
                retryButton = { id: 'retry-button-' + exam.id, text: '重新考试' };
            exam.buttons = [];
            if (currentTime < exam.startTime) {
                exam.status = 1;
            } else if (currentTime > exam.startTime && currentTime < exam.endTime) {
                exam.status = 2;
                if (exam.needApplicant !== 1 || (exam.signUp && exam.signUp.status === 2)) {
                    if (exam.examRecord.status < 4) {
                        exam.buttons = [toExamButton];
                    }
                    if (exam.examRecord.status >= 5 && exam.isShowAnswerImmed === 1) {
                        exam.buttons = [toDetailButton];
                    }
                    if (exam.examRecord.status >= 5 && exam.allowExamMuchTimes >= 0) {
                        exam.buttons.push(retryButton);
                    }
                }
            } else if (currentTime > exam.endTime) {
                exam.status = 3;
                if (exam.examRecord.status >= 5) {
                    exam.buttons = [toDetailButton];
                    if (exam.hasCert === 1) {
                        exam.buttons.push(toCertButton);
                    }
                }
            }
            if (currentTime > exam.applicantStartTime
                && currentTime < exam.applicantEndTime
                && exam.needApplicant === 1
                && !exam.examRecord) {
                exam.status = 4;
                if (!exam.signUp || !exam.signUp.status) {
                    exam.buttons = [signupButton];
                } else {
                    exam.buttons.push(cancelButton);
                }
            }
            if (exam.signUp && exam.signUp.status === 1) {
                exam.status = 5;
            }
            if (exam.signUp && exam.signUp.status === 3) {
                exam.status = 6;
            }
            exam.passScore = exam.passScore ? exam.passScore / 100 : '';
            if (exam.examRecord && exam.examRecord.totalScore) {
                exam.examRecord.totalScore /= 100;
            }
            return exam;
        });
        return exams;
    }
};
