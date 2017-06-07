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
        } else if (payload.sectionType === 4) {
            this.module.dispatch('getAttachment', { id: payload.attachmentId }).then(function(data) {
                var att = data[0];
                var view = me.module.items['preview-scrom'];
                if (att.translateFlag !== 1) {
                    return me.app.message.error('文档还未处理完，请稍后查看');
                }
                return me.module.dispatch('getScormTree', { id: payload.attachmentId }).then(function() {
                    return me.app.viewport.ground(view, { section: payload, path: att.path });
                });
            });
        }
        this.module.dispatch('showSection', { section: payload });
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
            progress = this.bindings.progress,
            sectionType = element.getAttribute('data-sectionType'),
            section = courseModel.findSection(id),
            chapter = courseModel.findChapter(section.chapterId);
        var oldSectionId = this.bindings.playerState.data.sectionId;
        var beforeSection = courseModel.findBeforeSection(id);
        var hander = showHandler(section).bind(this);
        var beforeProcess = beforeSection ? progress.findProgress(beforeSection.referenceId) : null;
        e.preventDefault();
        // 如果点击的是当前节,直接返回
        if (oldSectionId === id && courseUtil.judgeSection(sectionType)) {
            return false;
        }
        // 如果没学习过的 才判断顺序
        if (!progress.findProgress(section.referenceId)) {
            // 如果必须按章顺序
            if (courseModel.data.learnSequence === 1) {
                if (!courseModel.isChapterSequence(oldSectionId, id)) {
                    this.app.message.error('必须按章顺序学习');
                    return false;
                }
            }
            // 如果当前所在章的规则必须按顺序
            if (chapter.learnSequence === 1) {
                if (!beforeProcess || beforeProcess.finishStatus === 1) {
                    this.app.message.error('前面的课节还没学完');
                    return false;
                }
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
                    if (rr.sectionType === 8 && sectionProcess.score > 0) {
                        if (sectionProcess.score) sectionProcess.score = Number(sectionProcess.score) / 10;
                        rr.finishStatus += '成绩' + sectionProcess.score + ' ';
                    }
                    if (rr.sectionType === 9 && sectionProcess.examScore > 0) {
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
