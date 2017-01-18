var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    options = {
        charset: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        before: '第',
        after: '节'
    },
    btnTexts = {
        2: '重新学习',
        4: '重新学习'
    };
// 阶段序号转义
exports.rowHeader = function(arr, payload) {
    var opt = D.assign(options, payload);
    _.map(arr || [], function(obj, i) {
        var c = obj;
        c.i = opt.before + opt.charset[i] + opt.after;
        if (i === 0) c.first = true;
        if (i === arr.length - 1) c.last = true;
    });
};

// 计算剩余天数
exports.restStudyDays = function(registerTime, studyDays) {
    var currentTime = new Date().getTime(),
        days = Math.floor((currentTime - registerTime) / (24 * 3600 * 1000)),
        restDays = Number(studyDays) - days;
    return restDays < 0 ? 0 : restDays;
};

// 分配节按钮地址
exports.setBtn = function(chapters, type) {
    var courseChapters = chapters;
    _.map(courseChapters || [], function(obj) {
        _.map(obj.courseChapterSections || [], function(sec) {
            var section = sec,
                progress = section.progress,
                sectionType = Number(section.sectionType);
            if (sectionType === 10) {
                section.btnUrl = '#/study/course/detail/' + section.resourceId;
                section.btnText = '进入课程';
            } else if (sectionType === 3) {
                section.btnUrl = section.url;
                section.btnText = '打开URL';
            } else if (sectionType === 8) {
                section.btnUrl = '#/study/task/' + section.id;
                section.btnText = '进入任务';
            } else if (sectionType === 9) {
                section.btnUrl = '#/exam/index/' + section.resourceId;
                section.btnText = '进入考试';
            }
            section.preview = true;
            if (type === 'preview') {
                section.preview = false;
            }
            if (progress && progress.finishStatus !== 0) {
                section.btnText = btnTexts[section.finishStatus] || '继续学习';
            }
            return section;
        });
        return obj.courseChapterSections;
    });
    return courseChapters;
};
