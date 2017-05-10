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
        var me = this;
        var callback = function() {
            me.module.dispatch('updateProgress');
        };
        var winOpen;
        var timer = setInterval(function() {
            if (winOpen && winOpen.closed) {
                clearInterval(timer);
                setTimeout(callback, 3000);
            }
        }, 1000);
        if (payload.sectionType === 8) {
            winOpen = window.open(detailUrlMap[8] + '' + payload.referenceId, '_blank');
        } else if (payload.sectionType === 9) {
            winOpen = window.open(detailUrlMap[9] + '' + payload.resourceId, '_blank');
        }
        this.module.dispatch('showSection', payload);
    };
};

var statusMap = {
    8: {
        0: '查看作业',
        5: '待评审',
        2: '',
        6: '重新提交',
    },
    9: {
        0: '参与考试',
        5: '待评卷',
        2: '',
        6: '重新考试',
    },
    12: {
        0: '参与调研',
        5: '待评审',
        2: '查看详情',
        6: '重新提交',
    },
    13: {
        0: '参与评估',
        5: '待评审',
        2: '查看详情',
        6: '重新提交',
    }
};

exports.bindings = {
    course: true,
    state: true,
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
                    var sectionProcess = progress.findProgress(rr.referenceId);
                    rr.seq = courseUtil.seqName(j + 1, 2);
                    if (data.playerState.sectionId === rr.id) {
                        rr.focus = true;
                    }
                    rr.beginStatus = '开始学习';
                    if (statusMap[rr.sectionType]) rr.beginStatus = statusMap[rr.sectionType][0];
                    if (!sectionProcess) return;
                    rr.showRate = [5, 6].indexOf(rr.sectionType) !== -1
                        && sectionProcess.finishStatus === 1;
                    rr.completedRate = sectionProcess.completedRate || 0;
                    // Rate
                    // rr.finishStatus = maps.getValue('course-study-status', sectionProcess.finishStatus);
                    rr.finishStatus = '';
                    if (rr.sectionType === 8 || sectionProcess.score > 0) {
                        rr.finishStatus += '成绩' + sectionProcess.score + ' ';
                    }
                    if (rr.sectionType === 9 || sectionProcess.examScore > 0) {
                        rr.finishStatus += '成绩' + sectionProcess.examScore + ' ';
                    }
                    if (statusMap[rr.sectionType]) {
                        rr.finishStatus += statusMap[rr.sectionType][sectionProcess.finishStatus];
                    } else {
                        rr.finishStatus += maps.getValue('course-study-status', sectionProcess.finishStatus);
                    }
                });
            });
        }
        return course;
    }
};
