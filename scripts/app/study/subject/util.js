var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    options = {
        charset: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        before: '第',
        after: '节'
    },
    defaultBtnTexts = { 3: '开始学习', 8: '查看作业', 9: '参与考试', 10: '开始学习', 12: '参与调研', 13: '参与评估', 14: '进入直播' },
    studyBtnTexts = { 2: '重新学习', 4: '重新学习', 5: '查看详情', 6: '查看详情' },
    studyBtnColor = { 2: 'custom-bg-color-5', 4: 'custom-bg-color-5' },
    prefixUrl = {
        8: '#/study/task/',
        10: '#/study/course/detail/',
        14: '#/gensee/detail/'
    },
    btnTextStudy;
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
        days,
        restDays;
    if (currentTime > registerTime) {
        days = Math.floor((currentTime - registerTime) / (24 * 3600 * 1000));
    } else {
        days = 0;
    }
    restDays = Number(studyDays) - days;
    return restDays < 0 ? 0 : restDays;
};

// 分配节按钮地址
exports.setBtn = function(chapters, type, currentSectionId) {
    var courseChapters = chapters;
    _.map(courseChapters || [], function(obj) {
        _.map(obj.courseChapterSections || [], function(sec) {
            var section = sec,
                progress = section.progress,
                sectionType = Number(section.sectionType);
            section.btnText = defaultBtnTexts[sectionType];
            section.btnColor = 'custom-bg-color-2';
            debugger;
            if (progress && progress.id && progress.finishStatus !== 0) {
                section.btnText = studyBtnTexts[progress.finishStatus] || '继续学习';
                if (btnTextStudy[sectionType]) section.btnText = btnTextStudy[sectionType].call(this, progress);
                section.btnColor = studyBtnColor[progress.finishStatus] || 'custom-bg-color-4';
            }
            if (sectionType === 3) {
                section.btnUrl = section.url;
            } else if (sectionType === 8) {
                section.btnUrl = prefixUrl[sectionType] + section.referenceId;
            } else {
                section.btnUrl = prefixUrl[sectionType] + section.resourceId;
            }
            section.preview = true;
            if (type === 'preview') {
                section.preview = false;
            }
            if (currentSectionId === section.id) {
                section.current = true;
            }
            return section;
        });
        return obj.courseChapterSections;
    });
    return courseChapters;
};


btnTextStudy = {
    8: function(progress) {
        var auditSocre = progress.score || 0,
            score = (auditSocre / 100).toFixed(1);
        if (progress.finishStatus === 5) return '待评审';
        if (progress.finishStatus === 1 || progress.finishStatus === 2) return '成绩' + score;
        return '查看作业';
    },
    9: function(progress) {
        var examScore = progress.examScore || 0,
            score = (examScore / 100).toFixed(1);
        if (progress.finishStatus === 7) return '待评卷';
        if (progress.finishStatus === 1 || progress.finishStatus === 2) return '成绩' + score;
        return '进入考试';
    },
    12: function() {
        return '查看详情';
    },
    13: function() {
        return '查看详情';
    }
};
