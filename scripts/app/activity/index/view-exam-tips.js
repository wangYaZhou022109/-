exports.title = '考试须知';

exports.small = true;

exports.bindings = {
    currentExam: true
};
exports.events = {
    'click close-button': 'closeButton',
    'click cancel-button': 'cancelButton',
    'click signup-button': 'signupButton',
    'click to-exam-button': 'toExamButton'
};

exports.handlers = {
    closeButton: function() {
        this.app.viewport.closeModal();
    },
    cancelButton: function() {
        var me = this,
            examId = this.renderOptions.exam.id;
        me.module.dispatch('revoke', examId).then(function() {
            me.module.dispatch('refreshCurrentExam', examId);
        });
    },
    signupButton: function() {
        var me = this,
            examId = this.renderOptions.exam.id;
        me.module.dispatch('signUp', examId).then(function() {
            me.module.dispatch('refreshCurrentExam', examId);
        });
    },
    toExamButton: function() {
        var id = this.renderOptions.exam.id,
            url = '#/exam/exam/answer-paper/' + id;
        window.open(url, '_blank');
    }
};
exports.dataForTemplate = {
    currentExam: function() {
        var exam = this.renderOptions.exam,
            currentTime = new Date().getTime(),
            closeButton = { id: 'close-button', text: '我已经知道了' },
            cancelButton = { id: 'cancel-button', text: '取消报名' },
            signupButton = { id: 'signup-button', text: '我要报名' },
            toExamButton = { id: 'to-exam-button', text: '进入考试' };
        if (exam.needApplicant === 1) {
            if (currentTime < exam.applicantStartTime) {
                exam.content = '您好,本次考试尚未到报名时间，请在报名时间' +
                                exam.applicantStartTime + '-' + exam.applicantEndTime +
                                '内报名，谢谢';
                exam.buttons = [closeButton];
            } else if (currentTime > exam.applicantStartTime && currentTime < exam.applicantEndTime) {
                if (!exam.signUp || !exam.signUp.status) {
                    exam.content = '您好,本次考试需要进行报名，请点击下方“我要报名”进行报名，谢谢';
                    exam.buttons = [signupButton];
                } else if (exam.signUp && exam.signUp.status === 1) {
                    exam.content = '您好,本次考试您已经报名，正在审核中，如要取消报名请点击下方“取消报名”';
                    exam.buttons = [cancelButton];
                } else if (exam.signUp && exam.signUp.status === 2) {
                    exam.content = '您好,本次考试您已经报名，请在考试时间内参与考试，谢谢';
                    exam.buttons = [cancelButton, closeButton];
                } else if (exam.signUp && exam.signUp.status === 3) {
                    exam.content = '您好,本次考试您的报名未审核通过';
                    exam.buttons = [closeButton];
                }
            } else if (currentTime > exam.applicantEndTime) {
                if (exam.signUp && exam.signUp.status === 2) {
                    exam.content = '点击下方“开始考试”后将会立即进入考试，该考试时长为' + exam.duration + '分钟';
                    exam.buttons = [toExamButton];
                } else {
                    exam.content = '您好,本次考试报名时间已经结束';
                    exam.buttons = [closeButton];
                }
            }
        } else if (currentTime < exam.startTime) {
            exam.content = '您好,本次考试尚未到报名时间，请在报名时间' +
                            exam.applicantStartTime + '-' + exam.applicantEndTime +
                            '内报名，谢谢';
            exam.buttons = [closeButton];
        } else if (currentTime > exam.startTime && currentTime < exam.endTime) {
            if (exam.examNotes && exam.examNotes !== '') {
                exam.content = exam.examNotes;
            } else {
                exam.content = '点击下方“开始考试”后将会立即进入考试，该考试时长为' + exam.duration + '分钟';
            }
            exam.buttons = [toExamButton];
        } else {
            exam.content = '您好,本次考试已结束或已到进入考试截止时间';
            exam.buttons = [closeButton];
        }
        return exam;
    }
};
