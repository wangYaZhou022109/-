var util = require('./app/study-subject/util');
exports.bindings = {
    region: false,
    subject: false,
    state: false
};


exports.dataForTemplate = {
    subject: function(data) {
        var subject = data.subject,
            progress = subject.studyProgress || {};
        util.rowHeader(subject.courseChapters, {
            after: '',
            before: '阶段'
        });
        // 计算剩余天数
        subject.restDays = 0;
        if (progress) {
            subject.restDays = util.restStudyDays(progress.createTime, subject.studyDays);
        }
        // 配置按钮地址
        subject.courseChapters = util.setBtnUrl(subject.courseChapters);
        return subject;
    },
    preview: function(data) {
        var state = data.state || {};
        if (state.type === 'preview') {
            return false;
        }
        return true;
    }
};
