exports.bindings = {
    exam: true,
    signup: true
};

exports.type = 'dynamic';

exports.getEntity = function() {
    return {
        endTime: this.bindings.exam.data.endTime,
        duration: this.bindings.exam.data.duration
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
            me.app.viewport.modal(me.module.items.tips, { message: '距离考试开始时间' });
        }
    };
};
exports.events = {
    'click signup': 'signup',
    'click revoke': 'revoke',
    'click toExam': 'toExam'
};

exports.handlers = {
    signup: function() {
        var me = this;
        return me.module.dispatch('signup');
    },
    revoke: function() {
        var me = this;
        return me.module.dispatch('revoke');
    },
    toExam: function() {
        this.app.show('content', 'exam/answer-paper', { examId: this.bindings.exam.data.id });
    }
};

exports.dataForTemplate = {
    handlerBtn: function() {
        var exam = this.bindings.exam.data,
            signup = this.bindings.signup.data,
            currentTime = new Date().getTime(),
            result = '';
        if (exam.type && exam.type === 1) {
            if (!signup || !signup.id) {
                result = 'signup';
            } else if (currentTime >= exam.startTime && currentTime < exam.endTime) {
                result = 'startExam';
            } else if (exam.type === 1 && signup.status === 1) {
                result = 'waitReview';
            } else if (exam.type === 1 && signup.status === 3) {
                result = 'rejected';
            } else {
                result = 'prepare';
            }
        } else if (exam.type && exam.type !== 1) {
            if (currentTime >= exam.startTime && currentTime < exam.endTime) {
                result = 'startExam';
            } else {
                result = 'prepare';
            }
        }
        return result;
    }
};
