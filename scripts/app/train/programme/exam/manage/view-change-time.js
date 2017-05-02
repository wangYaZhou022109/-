exports.title = '时间变更';

exports.bindings = {
    exam: true
};

exports.components = [function() {
    var exam = this.bindings.exam.data;
    if (exam.applicantEndTime <= new Date().getTime()) return null;
    return {
        id: 'applicant-end-time',
        name: 'flatpickr',
        options: {
            enableTime: true
        }
    };
}, function() {
    var exam = this.bindings.exam.data;
    if (exam.startTime <= new Date().getTime()) return null;
    return {
        id: 'start-time',
        name: 'flatpickr',
        options: {
            enableTime: true
        }
    };
}, function() {
    var exam = this.bindings.exam.data;
    if (exam.endTime <= new Date().getTime()) return null;
    return {
        id: 'end-time',
        name: 'flatpickr',
        options: {
            enableTime: true
        }
    };
}];

exports.events = {
    'change applicant-end-time': 'checkApplicantEndTime',
    'change start-time': 'checkStartTime'
};

exports.handlers = {
    checkApplicantEndTime: function() {
        var applicantEndTime = new Date(this.bindings.exam.data.applicantEndTime).getTime(),
            nowTime = new Date().getTime();
        if (nowTime >= applicantEndTime) {
            this.app.message.error('已到报名截止时间，不能修改该字段');
            return false;
        }
        return true;
    },
    checkStartTime: function() {
        var startTime = new Date(this.bindings.exam.data.startTime).getTime(),
            nowTime = new Date().getTime();
        if (nowTime >= startTime) {
            this.app.message.error('已到开始时间，不能修改该字段');
            return false;
        }
        return true;
    }
};

exports.dataForTemplate = {
    isSignUpExam: function() {
        return Number(this.bindings.exam.data.type) === 1;
    }
};

exports.buttons = [{
    text: '确认',
    action: 'changeTime'
}];

exports.dataForActions = {
    changeTime: function(data) {
        return data;
    }
};
