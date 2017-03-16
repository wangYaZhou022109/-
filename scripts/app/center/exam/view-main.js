var _ = require('lodash/collection');
exports.bindings = {
    exams: true,
    search: false
};
exports.events = {
    'click cancel-button-*': 'cancelButton',
    'click signup-button-*': 'signupButton',
    'click to-exam-button-*': 'toExamButton',
    'click to-cert-button-*': 'toCertButton',
    'click to-detail-button-*': 'toDetailButton'
};

exports.handlers = {
    cancelButton: function(examId) {
        var me = this;
        me.module.dispatch('revoke', examId).then(function() {
            me.module.dispatch('refreshList');
        });
    },
    signupButton: function(examId) {
        var me = this;
        me.module.dispatch('signUp', examId).then(function() {
            me.module.dispatch('refreshList');
        });
    },
    toExamButton: function(examId) {
        var url = '#/exam/exam/answer-paper-2/' + examId;
        window.open(url, '_blank');
    },
    toCertButton: function(examId) {
        var url = '#/exam/exam/answer-paper-2/' + examId;
        window.open(url, '_blank');
    },
    toDetailButton: function(examId) {
        var url = '#/exam/exam/answer-paper-2/' + examId;
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
                toDetailButton = { id: 'to-detail-button-' + exam.id, text: '查看详情' };
            if (exam.needApplicant === 1) {
                if (currentTime > exam.applicantStartTime && currentTime < exam.applicantEndTime) {
                    if (!exam.signUp || !exam.signUp.status) {
                        exam.buttons = [signupButton];
                    } else if (exam.signUp && exam.signUp.status === 1) {
                        exam.buttons = [cancelButton];
                    } else if (exam.signUp && exam.signUp.status === 2) {
                        exam.buttons = [cancelButton];
                    }
                } else if (currentTime > exam.applicantEndTime) {
                    if (exam.signUp && exam.signUp.status === 2) {
                        exam.buttons = [toDetailButton];
                        if (exam.hasCert === 1) {
                            exam.buttons.push(toCertButton);
                        }
                    }
                }
            } else if (currentTime > exam.startTime && currentTime < exam.endTime) {
                exam.buttons = [toExamButton];
            }
            return exam;
        });
        return exams;
    }
};
