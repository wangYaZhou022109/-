var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    P = require('./app/activity/index/exam-prompt/prompt-help'),
    getRecordStatus,
    urlMap = {
        answer: '#/exam/exam/answer-paper/',
        detail: '#/exam/exam/score-detail/',
        cert: ''
    };

exports.bindings = {
    exams: true
};

exports.actions = {
    'click cancel-button-*': 'cancel',
    'click signup-button-*': 'signUp',
};

exports.dataForActions = {
    cancel: function(data) {
        return { examId: data.id };
    },
    signUp: function(data) {
        return { examId: data.id };
    },
};

exports.events = {
    'click to-exam-button-*': 'toExam',
    'click to-cert-button-*': 'toCert',
    'click to-detail-button-*': 'toDetail',
    'click retry-button-*': 'retry'
};

exports.handlers = {
    toExam: function(examId) {
        window.open(urlMap.answer + examId, '_blank');
    },
    toCert: function(examId) {
        window.open(urlMap.cert + examId, '_blank');
    },
    toDetail: function(examId) {
        window.open(urlMap.detail + examId, '_blank');
    },
    retry: function(examId) {
        window.open(urlMap.answer + examId, '_blank');
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'exams' }
}];

// 1: 报名考试， 需要报名
// 2: 报名考试， 待审核
// 3: 报名考试， 报名通过
// 4: 考试活动还没开始
// 5: 进行考试
// 6: 可多次考，可查看上次考试成绩详情
// 7: 可查看上次考试成绩详情
// 8: 考试结束
// 9: 考试活动结束 可查看考试详情
// 10: 报名考试，超出报名时间范围
// 11: 查看证书
// 12: 考试已撤销
exports.dataForTemplate = {
    exams: function(data) {
        var exams = data.exams;
        return _.map(exams, function(e, n) {
            var cancelButton = { id: 'cancel-button-' + e.signUp.id, value: e.signUp.id, text: '取消报名' },
                signupButton = { id: 'signup-button-' + e.id, value: e.id, text: '我要报名' },
                toExamButton = { id: 'to-exam-button-' + e.id, value: e.id, text: '进入考试' },
                toCertButton = { id: 'to-cert-button-' + e.id, value: e.id, text: '查看证书' },
                toDetailButton = {
                    id: 'to-detail-button-' + (e.examRecord.id || n),
                    value: e.examRecord.id || n,
                    text: '查看详情'
                },
                retryButton = { id: 'retry-button-' + e.id, value: e.id, text: '重新考试' },
                buttonMap = {
                    1: [signupButton],
                    2: [cancelButton],
                    3: [cancelButton],
                    4: [],
                    5: [toExamButton],
                    6: [retryButton, toDetailButton],
                    7: [toDetailButton],
                    8: [],
                    9: [toDetailButton],
                    10: [],
                    11: [toDetailButton, toCertButton],
                    12: [],
                    13: []
                };
            return D.assign(e, {
                status: getRecordStatus(e),
                examRecord: D.assign(
                    e.examRecord,
                    { score: e.examRecord.score ? e.examRecord.score / 100 : 0 },
                    { totalScore: e.examRecord.totalScore ? e.examRecord.totalScore / 100 : 0 }
                ),
                buttons: buttonMap[P.getUserStatusOfExam(e)],
            });
        });
    }
};

getRecordStatus = function(exam) {
    var currentTime = new Date().getTime();
    if (exam.startTime < currentTime && exam.examRecord.status === 1) {
        return 1;
    }

    if (currentTime < exam.startTime) {
        return 2;
    }

    if (exam.signUp && exam.signUp.status === 1) {
        return 3;
    }

    if (exam.examRecord && exam.examRecord.status === 5) {
        return 4;
    }

    if (exam.examRecord && exam.examRecord.status >= 4) {
        return 5;
    }

    return 0;
};

exports.actionCallbacks = {
    signUp: function() {
        this.app.message.success('报名成功');
    },
    cancel: function() {
        this.app.message.success('取消报名成功');
    }
};
