var prompts = {
        1: '您好，本次考试尚未到考试时间，请在考试时间{0}内进行考试，谢谢',
        2: '点击下方“查看详情”可查看上次考试成绩详情',
        3: '您好，本次考试没有通过，点击下方“重新考试”后将会立即重新考试，点击下方“查看详情”可查看考试成绩详情',
        4: '点击下方“开始考试”后将会立即进入考试，该考试时长为{0}分钟',
        5: '您好,本次考试已结束',
        6: '点击下方“查看详情”可查看考试成绩详情'
    },
    P = require('./app/exam/exam/other-exam-prompt/prompt-help'),
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
    'click exam-again-button': 'toExam'
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

// 1: 考试时间没到
// 2: 考试完成
// 3: 考试没通过 重新考
// 4: 进入考试
// 5: 考试结束
// 6： 查看详情
getCurrentExam = function(exam) {
    var status = P.getUserStatusOfExam(exam),
        knewButton = { id: 'had-knew-button', text: '我已经知道了' },
        examLaterButton = { id: 'exam-later-button', text: '以后再考' },
        comeLaterButton = { id: 'come-later-button', text: '以后再来' },
        toExamButton = { id: 'to-exam-button', text: '开始考试' },
        viewDetailButton = { id: 'view-detail-button', text: '查看详情' },
        examAgainButton = { id: 'exam-again-button', text: '重新考试' },
        buttonMap = {
            1: [knewButton],
            2: [knewButton, viewDetailButton],
            3: [comeLaterButton, examAgainButton],
            4: [examLaterButton, toExamButton],
            5: [knewButton],
            6: [knewButton, viewDetailButton]
        },
        getContent = function(exam0, str, status0) {
            if (status0 === 4) {
                return getWithParams(str, exam0.duration);
            }
            if (status0 === 1) {
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
