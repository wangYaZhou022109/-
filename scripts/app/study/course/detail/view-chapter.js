var $ = require('jquery'),
    A = require('./app/util/animation'),
    courseUtil = require('../course-util'),
    maps = require('./app/util/maps'),
    _ = require('lodash/collection');
var showHandler = function(payload) {
    // var innerType = [1, 2, 3, 5, 6]; // 内嵌的播放器
    var detailUrlMap = {
        8: '#/study/task/',
        9: '#/exam/exam/paper/'
    };
    return function() {
        // var me = this;
        if (payload.sectionType === 8) {
            window.open(detailUrlMap[8] + '' + payload.referenceId);
        } else if (payload.sectionType === 9) {
            window.open(detailUrlMap[9] + '' + payload.resourceId);
        }
        this.module.dispatch('showSection', payload);
    };
};

exports.bindings = {
    course: true,
    state: true,
    examStatus: true,
    researchStatus: true,
    progress: true,
    playerState: false
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
        if (this.bindings.playerState.data.sectionId === id && courseUtil.judgeSection(sectionType)) {
            return false;
        }
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
        var progress = this.bindings.progress;
        if (course.name) {
            _.forEach(course.courseChapters, function(item) {
                var r = item;
                _.forEach(r.courseChapterSections, function(obj, j) {
                    var rr = obj;
                    var examStatus;
                    var researchStatus;
                    var sectionProcess = progress.findProgress(rr.referenceId);
                    rr.seq = courseUtil.seqName(j + 1, 2);
                    if (data.playerState.sectionId === rr.id) {
                        rr.focus = true;
                    }
                    rr.showRate = [5, 6].indexOf(rr.sectionType) !== -1;

                    if (!sectionProcess) return;

                    rr.completedRate = sectionProcess.completedRate || 0;
                    // Rate
                    rr.finishStatus = maps.getValue('course-study-status', sectionProcess.finishStatus);
                    if (rr.sectionType === 9) {
                        examStatus = _.find(data.examStatus, { examId: rr.resourceId });
                        if (examStatus && examStatus.status) {
                            rr.finishStatus = examStatus.score ? '成绩' +
                            (Number(examStatus.score) / 100).toFixed(1) :
                            maps.getValue('exam-record-status', examStatus.status);
                        }
                    }
                    if (rr.sectionType === 12 || rr.sectionType === 13) {
                        researchStatus = _.find(data.researchStatus, { researchQuestionaryId: rr.resourceId });
                        if (researchStatus && researchStatus.status) {
                            rr.finishStatus = researchStatus.status === 1 ?
                            '查看详情' : maps.getValue('research-record', researchStatus.status);
                        }
                    }
                });
            });
        }
        return course;
    }
};
