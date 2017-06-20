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
        1: '学习中',
        5: '待审核',
        2: '',
        6: '重新提交',
    },
    9: {
        0: '参与考试',
        5: '待评卷',
        1: '考试中',
        2: '',
        6: '重新考试',
    },
    12: {
        0: '参与调研',
        1: '答卷中',
        5: '待审核',
        2: '查看详情',
        6: '重新提交',
    },
    13: {
        0: '参与评估',
        1: '答卷中',
        5: '待审核',
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
            sectionType = element.getAttribute('data-sectionType'),
            section = courseModel.findSection(id),
            chapter = courseModel.findChapter(section.chapterId);
        var hander = showHandler(section).bind(this);
        var oldSectionId = this.bindings.playerState.data.sectionId;
        e.preventDefault();
        // 如果点击的是当前节,直接返回
        if (oldSectionId === id && courseUtil.judgeSection(sectionType)) {
            return false;
        }
        // 如果当前所在章的规则必须按顺序
        if (chapter.learnSequence === 1) {
            if (!courseModel.checkSection(id)) {
                this.app.message.error('前面的课节还没学完');
                return false;
            }
        }
        // 如果必须按章顺序
        if (courseModel.data.learnSequence === 1) {
            if (!courseModel.checkChapter(id)) {
                this.app.message.error('必须按章顺序学习');
                return false;
            }
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
                    if (sectionProcess.finishStatus === 6 || sectionProcess.finishStatus === 2) {
                        if (rr.sectionType === 8) {
                            if (sectionProcess.score === null) rr.finishStatus += '成绩：无';
                            else rr.finishStatus += '成绩' + (Number(sectionProcess.score) / 10) + ' ';
                        }
                        if (rr.sectionType === 9) {
                            if (sectionProcess.score === null) rr.finishStatus += '成绩：无';
                            else rr.finishStatus += '成绩' + (sectionProcess.score / 100) + ' ';
                        }
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
