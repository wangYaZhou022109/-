var remoteExamUrlPrefix = 'https://dev9.zhixueyun.com/#/exam/index/';

exports.bindings = {
    exam: true,
    download: true
};

exports.events = {
    'click changeTime': 'changeTime'
};

exports.handlers = {
    changeTime: function() {
        this.app.viewport.popup(this.module.items['change-time']);
    }
};

exports.dataForTemplate = {
    headId: function(data) {
        if (data.exam.coverId) {
            return this.bindings.download.getFullUrl() + '?id=' + data.exam.coverId;
        }
        return '';
    },
    examUrl: function() {
        return remoteExamUrlPrefix + this.bindings.exam.data.id;
    },
    isSignUpExam: function() {
        return Number(this.bindings.exam.data.type) === 1;
    }
};

exports.components = [function() {
    var examId = this.bindings.exam.data.id;
    return {
        id: 'qrcode',
        name: 'qrcode',
        options: {
            text: examId
        }
    };
}];
