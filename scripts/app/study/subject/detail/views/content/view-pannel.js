var util = require('./app/study/subject/util');
exports.bindings = {
    region: false,
    subject: false,
    state: false
};

exports.events = {
    'click studyBtn-*': 'beginStudy'
};

exports.handlers = {
    beginStudy: function(id, events, element) {
        var url = element.getAttribute('data-url'),
            sectionType = element.getAttribute('data-section-type');
        window.open(url);
        // 文档、URL打开即完成
        if (Number(sectionType) === 1 || Number(sectionType) === 3) {
            this.module.dispatch('updateProgress', {
                sectionId: id,
                beginTime: new Date().getTime(),
                clientType: 0,
                finishStatus: 2, // 已完成
                completedRate: 100, // 已完成
            });
        }
    }
};

exports.dataForTemplate = {
    subject: function(data) {
        var subject = data.subject,
            progress = subject.studyProgress || {},
            state = data.state || {};
        util.rowHeader(subject.courseChapters, {
            after: '',
            before: '阶段'
        });
        // 计算剩余天数
        subject.studyDays = subject.studyDays ? subject.studyDays : 0;
        subject.restDays = 0;
        if (progress.createTime) {
            subject.restDays = util.restStudyDays(progress.createTime, subject.studyDays);
        }
        // 配置按钮地址
        subject.courseChapters = util.setBtn(subject.courseChapters, state.type);
        return subject;
    }
};
