var $ = require('jquery'),
    A = require('./app/util/animation'),
    courseUtil = require('../course-util'),
    maps = require('./app/util/maps'),
    _ = require('lodash/collection');
var currentSectionId = null;
var showHandler = function(payload) {
    var innerType = [1, 2, 3, 5, 6]; // 内嵌的播放器
    var detailUrlMap = {
        8: '#/study/task/',
        9: '#/exam/exam/paper/',
        12: '#/exam/research-activity/research-detail/'
    };
    return function() {
        var me = this;
        if (innerType.indexOf(payload.sectionType) !== -1) {
            this.module.dispatch('showSection', payload);
        } else if (payload.sectionType === 8) {
            window.open(detailUrlMap[payload.sectionType] + '' + payload.referenceId);
        } else if (detailUrlMap[payload.sectionType]) {
            window.open(detailUrlMap[payload.sectionType] + '' + payload.resourceId);
        } else if (payload.sectionType === 12 || payload.sectionType === 13) {
            this.bindings.state.data.currentType = payload.sectionType;
            this.module.dispatch('getResearchById', { id: payload.resourceId }).then(function() {
                me.app.viewport.modal(me.module.items['research-tips']);
            });
        }
    };
};

exports.bindings = {
    course: true,
    state: true,
    examStatus: true,
    researchStatus: true
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
                    var examStatus;
                    rr.seq = courseUtil.seqName(j, 2);
                    if (currentSectionId === rr.id) {
                        rr.focus = true;
                    }
                    if (rr.progress && !rr.progress.completedRate) {
                        rr.progress.completedRate = 0;
                    }
                    // Rate
                    rr.showRate = [5, 6].indexOf(rr.sectionType) !== -1;
                    if (rr.progress) {
                        rr.progress.finishStatus = maps.getValue('course-study-status', rr.progress.finishStatus);
                    }
                    if (rr.sectionType === 9) {
                        examStatus = _.find(data.examStatus, { examId: rr.resourceId });
                        if (examStatus && examStatus.status) {
                            if (!rr.progress) rr.progress = {};
                            rr.progress.finishStatus = maps.getValue('paper-instance-status', examStatus.status);
                        }
                    }
                    if (rr.sectionType === 12) {
                        examStatus = _.find(data.examStatus, { researchQuestionaryId: rr.resourceId });
                        if (examStatus && examStatus.status) {
                            if (!rr.progress) rr.progress = {};
                            rr.progress.finishStatus = maps.getValue('research-record', examStatus.status);
                        }
                    }
                });
            });
        }
        return course;
    }
};
