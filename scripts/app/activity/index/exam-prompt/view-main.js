var prompts = {
        1: '您好，本次考试需要进行报名，请点击下方“我要报名”进行报名，谢谢',
        2: '您好，本次考试您已报名，正在审核中，如要取消报名请点击下方“取消报名”',
        3: '您好，本次考试您已报名成功，请在考试时间内参与考试，谢谢。',
        4: '您好，本次考试尚未到考试时间，请在考试时间{0}内进行考试，谢谢',
        5: '点击下方“开始考试”后将会立即进入考试，该考试时长为{0}分钟',
        6: '您好，本次考试可以进行多次，点击下方“重新考试”后将会立即重新考试，点击下方“查看详情”可查看上次考试成绩详情',
        7: '点击下方“查看详情”可查看上次考试成绩详情',
        8: '您好，本次考试尚未到结束时间，您还无法查看答卷情况，谢谢。',
        9: '您好,本次考试已结束或已到进入考试截止时间, 点击下方“查看详情”可查看上次考试成绩详情',
        10: '您好，本次考试尚未到报名时间，请在报名时间{0}内报名，谢谢',
        12: '您好，本次考试已撤销',
        13: '您好,本次考试已结束',
        14: '点击下方“继续考试”将会继续您上次的答题',
        15: '您好，本次考试已截止报名，如有疑问请联系系统管理员，谢谢',
        16: '您好，系统正在处理您的考卷，稍后可查看详情。本次考试可以进行多次，点击下方“重新考试”后将会立即重新考试',
        17: '系统正在处理您的考卷，稍后可查看详情',
        18: '您好，本次考试您被重置了，点击下方"重新考试"后将会立即重新考试',
        20: '您好，本次考试尚未到结束时间，您还无法查看答卷情况。该考试可以进行多次，点击下方“重新考试”后将会立即重新考试'
    },
    P = require('./app/activity/index/exam-prompt/prompt-help'),
    getWithParams,
    getCurrentExam,
    helper = require('./app/util/helpers');

exports.bindings = {
    exam: true
};

exports.dataForTemplate = {
    currentExam: function(data) {
        var obj = getCurrentExam(data.exam);
        return {
            content: obj.content,
            buttons: obj.buttons,
            examNotes: data.exam.examNotes
        };
    }
};

exports.events = {
    'click close-button': 'close',
    'click had-knew-button': 'close',
    'click exam-later-button': 'close',
    'click come-later-button': 'close',
    'click to-exam-button': 'toExam',
    'click view-detail-button': 'viewDetail',
    'click exam-again-button': 'toExam',
    'click go-on-exam-button': 'toExam'
};

exports.actions = {
    'click cancel-button': 'cancel',
    'click signup-button': 'signUp',
};

exports.dataForActions = {
    signUp: function() {
        var examId = this.bindings.exam.data.id;
        return { examId: examId };
    }
};

exports.actionCallbacks = {
    cancel: function() {
        this.app.viewport.closeModal();
        this.app.message.success('取消报名成功');
    },
    signUp: function() {
        this.app.viewport.closeModal();
        this.app.message.success('报名成功');
    }
};

exports.handlers = {
    close: function() {
        if (this.module.renderOptions.toActivityHome) {
            this.app.navigate('activity/index', true);
            this.app.viewport.closeModal();
            return;
        }
        this.app.viewport.closeModal();
    },
    toExam: function() {
        var id = this.bindings.exam.data.id,
            url = '#/exam/exam/answer-paper/' + id;
        window.open(url, '_blank');
        this.app.viewport.closeModal();
    },
    viewDetail: function() {
        var id = this.bindings.exam.data.examRecord.id,
            url = '#/exam/exam/score-detail/' + id;
        window.open(url, '_blank');
        this.app.viewport.closeModal();
    }
};

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
// 12: 考试已撤销
// 14: 可考多次 不能马上查看详情
// 15: 报名时间截止
// 16: 答卷完，能重新考，试卷处理中
// 17: 答卷完，不能重新考，试卷处理中
getCurrentExam = function(exam) {
    var status = P.getUserStatusOfExam(exam),
        knewButton = { id: 'had-knew-button', text: '我已经知道了' },
        examLaterButton = { id: 'exam-later-button', text: '以后再考' },
        comeLaterButton = { id: 'come-later-button', text: '以后再来' },
        closeButton = { id: 'close-button', text: '关闭页面' },
        cancelButton = { id: 'cancel-button', text: '取消报名' },
        signupButton = { id: 'signup-button', text: '我要报名' },
        toExamButton = { id: 'to-exam-button', text: '开始考试' },
        viewDetailButton = { id: 'view-detail-button', text: '查看详情' },
        examAgainButton = { id: 'exam-again-button', text: '重新考试' },
        goOnExamButton = { id: 'go-on-exam-button', text: '继续考试' },
        buttonMap = {
            1: [comeLaterButton, signupButton],
            2: [closeButton, cancelButton],
            3: [cancelButton, knewButton],
            4: [knewButton],
            5: [examLaterButton, toExamButton],
            6: [examAgainButton, viewDetailButton, knewButton],
            7: [viewDetailButton, knewButton],
            8: [knewButton],
            9: [viewDetailButton],
            10: [knewButton],
            12: [knewButton],
            13: [knewButton],
            14: [goOnExamButton, knewButton],
            15: [knewButton],
            16: [examAgainButton, knewButton],
            17: [],
            18: [examAgainButton, knewButton],
            20: [examAgainButton, knewButton]
        },
        getContent = function(exam0, str, status0) {
            if (status0 === 5) {
                return getWithParams(str, exam0.duration);
            }
            if (status0 === 10) {
                return getWithParams(
                    str,
                    helper.dateMinute(exam0.applicantStartTime)
                        + '  ~  ' + helper.dateMinute(exam0.applicantEndTime)
                );
            }
            if (status0 === 4) {
                return getWithParams(
                    str,
                    helper.dateMinute(exam0.startTime)
                        + '  ~  ' + helper.dateMinute(exam0.endTime));
            }
            return str;
        };

    return {
        content: getContent(exam, prompts[status], status),
        buttons: buttonMap[status]
    };
};

getWithParams = function(value, params) {
    var str,
        i,
        p;

    if (!params) return value;

    if (params && !(params instanceof Array)) {
        p = [params];
    } else {
        p = params;
    }

    str = value;
    for (i = 0; i < p.length; i++) {
        str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), p[i]);
    }
    return str;
};
