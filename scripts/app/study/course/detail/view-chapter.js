var $ = require('jquery'),
    A = require('./app/util/animation'),
    courseUtil = require('../course-util'),
    _ = require('lodash/collection');
var currentSectionId = null;
var showHandler = function(payload) {
    var map = {
        1: 'showSection',
        3: 'showSection',
        5: 'showSection',
        6: 'showSection'
    };
    return function(sectionType) {
        var url;
        if (map[sectionType]) {
            this.module.dispatch(map[sectionType], payload);
        } else if (Number(sectionType) === 8) {
            url = '#/study/task/' + payload.referenceId;
            window.open(url);
        }
    };
};

exports.bindings = {
    course: true,
    state: true,
};

exports.events = {
    'click note-btn': 'showNote',
    'click toggle-catalog': 'toggleCatalog',
    'click show-sections*': 'showSection'
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
        var courseModel = this.bindings.course,
            course = courseModel.data,
            studyProgress = course.studyProgress,
            chapterId = element.getAttribute('data-chapterId'),
            chapterLearnSequence = element.getAttribute('data-chapter-learnSequence'),
            sectionType = element.getAttribute('data-sectionType'),
            section = courseModel.findSection(id);

        var hander = showHandler(section).bind(this);

        // e.stopPropagation();
        // 首先要判断该课程是否注册,如果没有注册,要为其注册,并且要在注册后更新course数据,刷新页面
        // 麻烦之处在于如何处理好刷新,不影响正在播放的当前节,让用户感知不到我们做了注册这一动作(待做)
        e.preventDefault();
        // 如果点击的是当前节,直接返回
        if (currentSectionId === id && courseUtil.judgeSection(sectionType)) {
            return false;
        }
        currentSectionId = id;
        // 判断章是否按顺序
        // 这里按顺序学,要获取上一节的学习进度completeRate,麻烦之处在于,我们更新上一节的进度是在
        // beforeClose中做的,我们点击这下一节时,上一节的进度可能还没有保存成功,所以可能需要在前端算
        // completeRate了,(待做)
        if (course.learnSequence === 1 && studyProgress.currentChapterId !== chapterId) {
            return this.app.message.error('该课程必须按章节顺序学');
        }
        // 判断节是否按顺序
        if (chapterLearnSequence === 1 && studyProgress.currentSectionId !== chapterId) {
            return this.app.message.error('该章节必须按顺序学');
        }
        // 设置样式
        if (element.nodeName === 'DL') {
            $(element).siblings().removeClass('focus');
            $(element).addClass('focus');
        } else {
            $(element).parents('dl').siblings().removeClass('focus');
            $(element).parents('dl').addClass('focus');
        }
        hander(sectionType);
        return true;
    }
};

exports.dataForTemplate = {
    course: function(data) {
        var course = data.course;
        if (course.name) {
            currentSectionId = data.state.sectionId || null;
            _.forEach(course.courseChapters, function(item, i) {
                var r = item;
                r.seq = courseUtil.seqName(i, 1);
                _.forEach(r.courseChapterSections, function(obj, j) {
                    var rr = obj;
                    rr.seq = courseUtil.seqName(j, 2);
                    if (currentSectionId === rr.id) {
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
