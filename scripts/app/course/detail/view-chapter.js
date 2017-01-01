var $ = require('jquery'),
    A = require('../../util/animation'),
    courseUtil = require('../course-util'),
    _ = require('lodash/collection');

exports.bindings = {
    course: true
};

exports.events = {
    'click note-btn': 'showNote',
    'click toggle-catalog': 'toggleCatalog',
    'click show-section-*': 'showSection'
};

exports.handlers = {
    showNote: function() {
        var courseSide = this.module.$('course-side-catalog');
        A.animate(courseSide, 'show-note');
    },
    toggleCatalog: function() {
        $(this.module.$('course-side-catalog')).toggleClass('collapse');
    },
    showSection: function(id, e, element) {
        var course = this.bindings.course.data,
            section = course.sections[id],
            chapter = course.chapters[section.chapterId],
            studyProgress = course.studyProgress,
            sectionType = section.sectionType,
            url = section.url;
        // 如果点击的是当前节,直接返回
        if (studyProgress.currentSectionId === id) {
            return false;
        }
        // 判断章是否按顺序
        if (course.learnSequence === 1 && studyProgress.currentChapterId !== chapter.id) {
            return this.app.message.error('该课程必须按章节顺序学');
        }
        // 判断节是否按顺序
        if (chapter.learnSequence === 1 && studyProgress.currentSectionId !== section.id) {
            return this.app.message.error('该章节必须按顺序学');
        }
        // 设置样式
        $(element).parents('dl').siblings().removeClass('focus');
        $(element).parents('dl').addClass('focus');
        // 设置当前章,节
        studyProgress.currentChapterId = chapter.id;
        studyProgress.currentSectionId = section.id;
        switch (sectionType) {
        // 1:文档 5:音频类 6:视频
        case 1:
        case 5:
        case 6:
            this.module.dispatch('showSection', { sectionId: id });
            break;
        // 调研
        case 2:
            break;
        // url
        case 3:
            window.open(url);
            break;
        // 电子书
        case 7:
            break;
        // 任务
        case 8:
            break;
        // 考试
        case 9:
            break;
        // 评估
        case 12:
            break;
        default:
        }
        return true;
    }
};

exports.dataForTemplate = {
    course: function(data) {
        var course = data.course,
            currentChapterId,
            currentSectionId;
        if (course.name) {
            if (!course.studyProgress) {
                currentChapterId = course.courseChapters[0].id;
                currentChapterId = course.courseChapters[0].courseChapterSections[0].id;
            } else if (course.studyProgress.currentChapterId && course.studyProgress.currentSectionId) {
                currentChapterId = course.studyProgress.currentChapterId;
                currentSectionId = course.studyProgress.currentSectionId;
            } else {
                currentChapterId = course.courseChapters[0].id;
                currentSectionId = course.courseChapters[0].courseChapterSections[0].id;
            }
            _.forEach(course.courseChapters, function(item, i) {
                var r = item;
                r.seq = courseUtil.seqName(i, 1);
                _.forEach(r.courseChapterSections, function(obj, j) {
                    var rr = obj;
                    rr.seq = courseUtil.seqName(j, 2);
                    if (currentChapterId === r.id && currentSectionId === rr.id) {
                        rr.focus = true;
                    }
                    if (rr.progress && !rr.progress.completedRate) {
                        rr.progress.completedRate = 0;
                    }
                });
            });
        }
        return course;
    }
};
