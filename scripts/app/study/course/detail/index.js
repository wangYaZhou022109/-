var _ = require('lodash/collection'),
    D = require('drizzlejs');
exports.items = {
    player: 'player',
    'player-title': '',
    chapter: 'chapter',
    note: 'note',
    info: 'info',
    comment: 'comment',
    download: 'download',
    topic: '',
    'releated-course': 'releated-course',
    student: '',
    'research-tips': ''
};

exports.store = {
    models: {
        course: {
            url: '../course-study/course-front',
            mixin: {
                findChapter: function(chapterId) {
                    return _.find(this.data.courseChapters, { id: chapterId });
                },
                findSection: function(sectionId) {
                    var duplicate = function(x) { return x.courseChapterSections; };
                    return _.find(_.flatMap(this.data.courseChapters, duplicate), { id: sectionId });
                },
                findSectionForReferId: function(referenceId) {
                    var duplicate = function(x) { return x.courseChapterSections; };
                    return _.find(_.flatMap(this.data.courseChapters, duplicate), { referenceId: referenceId });
                },
                findSectionsForType: function(type) {
                    var duplicate = function(x) { return x.courseChapterSections; };
                    return _.filter(_.flatMap(this.data.courseChapters, duplicate), { sectionType: type });
                },
                findFirstSection: function() {
                    var duplicate = function(x) { return x.courseChapterSections; };
                    return _.flatMap(this.data.courseChapters, duplicate)[0];
                }
            }
        },
        section: {},
        sectionProgress: {},
        // 注册课程
        register: { url: '../course-study/course-front/register' },
        note: { url: '../course-study/course-front/course-note' },
        notes: { url: '../course-study/course-front/course-notes' },
        collect: { url: '../system/collect' },
        courseRelated: { url: '../course-study/course-front/related', type: 'pageable', pageSize: 2, root: 'items' },
        download: { url: '../human/file/download' },
        lastestUser: { url: '../course-study/course-front/lastest-user', type: 'pageable', pageSize: 8, root: 'items' },
        score: { url: '../course-study/course-front/score' },
        state: {},
        examStatus: { url: '../exam/exam/status' }, // { examIds: jsonstr }
        researchStatus: { url: '../exam/research-activity/status' }, // { researchIds: jsonstr }
        researchActivity: { url: '../exam/research-activity' }
    },
    callbacks: {
        init: function(payload) {
            // 初始化当前课程
            var me = this,
                course = this.models.course,
                courseRelated = this.models.courseRelated,
                collect = this.models.collect,
                state = this.models.state;
            course.set(payload);
            courseRelated.params = payload;
            collect.params = { businessId: payload.id };
            this.get(courseRelated);
            this.get(collect);
            return this.get(course).then(function(c) {
                var sectionId = null;
                if (c[0].register) sectionId = course.findFirstSection().id;
                state.set({ id: payload.id, sectionId: sectionId, register: c.register }, true);
                return me.chain(
                    [(function() {
                        var researchIds = _.map(course.findSectionsForType(12), 'resourceId').join();
                        if (researchIds) {
                            me.models.researchStatus.params = { researchIds: researchIds };
                            me.get(me.models.researchStatus);
                        }
                    }()), (function() {
                        var examIds = _.map(course.findSectionsForType(9), 'resourceId').join();
                        if (examIds) {
                            me.models.examStatus.params = { examIds: examIds };
                            me.get(me.models.examStatus);
                        }
                    }())]
                );
            });
        },
        updateProgress: function(payload) {
            var course = this.models.course;
            var courseSectionProgress = payload[0];
            var section = course.findSectionForReferId(courseSectionProgress.sectionId);
            // set new progress
            section.progress = courseSectionProgress;
            course.changed();
        },
        showSection: function(payload) {
            var state = this.models.state;
            state.data.sectionId = payload.id;
            state.changed();
        },
        collect: function(payload) {
            var collect = this.models.collect;
            collect.set(payload);
            return this.save(collect);
        },
        cancelCollect: function(payload) {
            var collect = this.models.collect;
            collect.set(payload);
            return this.del(collect, { slient: true }).then(function() {
                collect.set({}, true);
            });
        },
        addNote: function(payload) {
            var me = this,
                note = this.models.note;
            note.set(payload);
            return this.save(note).then(function() {
                me.get(me.models.notes);
            });
        },
        removeNote: function(payload) {
            var me = this,
                note = this.models.note;
            note.set(payload);
            return this.del(note).then(function() {
                me.get(me.models.notes);
            });
        },
        updateNote: function(payload) {
            var me = this,
                note = this.models.note;
            note.set(payload);
            return this.save(note).then(function() {
                me.get(me.models.notes);
            });
        },
        turnPage: function() {
            var pageInfo = this.models.courseRelated.getPageInfo();
            if (pageInfo.pageCount === 0) return false;
            if (pageInfo.page === pageInfo.pageCount) {
                this.models.courseRelated.turnToPage(1);
            } else {
                this.models.courseRelated.nextPage();
            }
            return this.get(this.models.courseRelated);
        },
        score: function(payload) {
            // 评分
            var score = this.models.score,
                course = this.models.course;
            score.set(payload);
            return this.save(score).then(function(data) {
                course.data.avgScore = data[0].avgScore || course.data.avgScore;
                course.changed();
            });
        },
        register: function(payload) {
            var courseId = this.models.state.data.id,
                model = this.models.register,
                course = this.models.course,
                state = this.models.state,
                sectionId;
            if (payload && payload.sectionId) {
                sectionId = payload.sectionId;
            } else {
                sectionId = course.findFirstSection().id;
            }
            model.set({ courseId: courseId });
            // 注册完毕自动播放第一章或者指定的章节
            this.chain(
                this.post(model),
                function(data) {
                    course.set(data[0], true); // 刷新课程
                },
                function() {
                    // this.app.message.alert('注册完毕，开始播放课程');
                    D.assign(state.data, { sectionId: sectionId, register: true });
                    state.changed(); // 改变播放
                }
            );
        },
        getResearchById: function(payload) {
            var model = this.models.researchActivity;
            model.set({ id: payload.id });
            return this.get(model);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
