var helpers = require('./app/util/helpers');
exports.bindings = {
    exam: true
};

exports.dataForTemplate = {
    message: function(data) {
        var exam = data.exam;
        var startTime = helpers.dateTime(exam.startTime);
        return {
            members: '您好，请您于' + startTime + '准时参加《' + exam.name + '》考试，谢谢。',
            teachers: '您好，您已被安排为《' + exam.name +
                '》考试的评卷老师，该考试将于' + startTime +
                '准时开始，考试时长' + exam.duration +
                '分钟,请合理安排工作时间尽快阅卷。谢谢。'
        };
    }
};
