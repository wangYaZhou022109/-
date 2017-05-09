var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    helper = require('./app/util/helpers'),
    options = {
        charset: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        before: '第',
        after: '节'
    },
    studyBtnColor = { 2: 'custom-bg-color-5', 4: 'custom-bg-color-5' },
    items;
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
exports.addItem = function(chapters, type, currentSectionId) {
    var courseChapters = chapters;
    _.map(courseChapters || [], function(obj) {
        _.map(obj.courseChapterSections || [], function(sec) {
            var section = sec,
                progress = section.progress,
                sectionType = Number(section.sectionType);
            if (items[sectionType]) section.item = items[sectionType].call(this, section);
            section.item.btnColor = 'custom-bg-color-2';
            if (progress && progress.id && progress.finishStatus !== 0) {
                section.item.btnColor = studyBtnColor[progress.finishStatus] || 'custom-bg-color-4';
            }
            section.preview = type !== 'preview';
            section.current = currentSectionId === section.referenceId;
            return section;
        });
        return obj.courseChapterSections;
    });
    return courseChapters;
};

items = {
    3: function(section) {
        var progress = section.progress || { finishStatus: 0 },
            btnText = { 0: '开始学习', 2: '重新学习' };
        return { btnText: btnText[progress.finishStatus] };
    },
    8: function(section) {
        var progress = section.progress || { finishStatus: 0 },
            auditSocre = progress.score || 0,
            score = auditSocre,
            btnText = { 0: '查看作业', 1: '查看详情', 2: '查看详情', 5: '查看详情', 6: '重新提交' },
            statusText = { 1: '成绩：' + score, 2: '成绩：' + score, 5: '待评审', 6: '成绩：' + score };
        return {
            btnText: btnText[progress.finishStatus],
            statusText: statusText[progress.finishStatus]
        };
    },
    9: function(section) {
        var progress = section.progress || { finishStatus: 0 },
            resource = section.resource || {},
            examScore = progress.examScore || 0,
            score = (examScore / 100).toFixed(1),
            btnText = { 0: '进入考试', 1: '查看详情', 2: '查看详情', 7: '查看详情' },
            statusText = { 1: '成绩：' + score, 2: '成绩：' + score, 7: '待评卷' },
            timeText;
        if (resource && resource.startTime && resource.endTime) {
            timeText = helper.dateMinute(resource.startTime) + ' 至 ' + helper.dateMinute(resource.endTime);
        }
        return {
            btnText: btnText[progress.finishStatus],
            statusText: statusText[progress.finishStatus],
            timeText: timeText
        };
    },
    10: function(section) {
        var progress = section.progress || { finishStatus: 0 },
            btnText = { 0: '开始学习', 1: '继续学习', 2: '重新学习', 4: '重新学习' };
        return { btnText: btnText[progress.finishStatus] };
    },
    12: function(section) {
        var progress = section.progress || { finishStatus: 0 },
            btnText = { 0: '参与调研', 2: '查看详情' };
        return { btnText: btnText[progress.finishStatus] };
    },
    13: function(section) {
        var progress = section.progress || { finishStatus: 0 },
            btnText = { 0: '参与评估', 2: '查看详情' };
        return { btnText: btnText[progress.finishStatus] };
    },
    14: function(section) {
        var resource = section.resource || {},
            currentTime = new Date().getTime(),
            btnText,
            statusText;
        if (resource.endTime && currentTime > resource.endTime) {
            btnText = '查看详情';
            statusText = '已结束';
        } else {
            btnText = '进入直播';
            statusText = '直播时间：' + helper.dateMinute(resource.startTime);
        }
        return { btnText: btnText, statusText: statusText };
    }
};
