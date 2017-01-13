var _ = require('lodash/collection'),
    D = require('drizzlejs');
exports.items = {
    player: 'player',
    'player-title': 'player-title',
    chapter: 'chapter',
    note: 'note',
    info: 'info',
    comment: 'comment',
    download: 'download',
    topic: 'topic',
    'releated-course': 'releated-course',
    student: 'student'
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
        courseScore: {},
        state: {}
    },
    callbacks: {
        init: function(payload) {
            // 初始化当前课程
            var course = this.models.course,
                // score = this.models.score,
                courseRelated = this.models.courseRelated,
                notes = this.models.notes,
                lastestUser = this.models.lastestUser,
                collect = this.models.collect,
                state = this.models.state;
            course.set(payload);
            courseRelated.params = payload;
            notes.params = { courseId: payload.id };
            lastestUser.params = { courseId: payload.id };
            collect.params = { businessId: payload.id };

            this.chain([
                this.get(course).then(function(c) {
                    var sectionId = null;
                    if (c[0].register) sectionId = course.findFirstSection().id;
                    state.set({ id: payload.id, sectionId: sectionId, register: c.register }, true);
                }),
                this.get(courseRelated),
                this.get(lastestUser),
                this.get(collect),
                this.get(notes)
            ]);
        },
        updateProgress: function(payload) {
            var course = this.models.course;
            var courseSectionProgress = payload[0];
            var section = course.findSection(courseSectionProgress.sectionId);
            // set new progress
            section.progress = courseSectionProgress;
            course.changed();
        },
        showSection: function(payload) {
            var state = this.models.state;
            state.data.sectionId = payload.sectionId;
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
            if (pageInfo.page === pageInfo.pageCount) {
                this.models.courseRelated.turnToPage(1);
            } else {
                this.models.courseRelated.nextPage();
            }
            return this.get(this.models.courseRelated);
        },
        score: function() {
            // 评分
            var score = this.models.score,
                course = this.models.course;
            score.data.businessId = course.data.id;
            score.data.businessType = 1;
            return this.save(score).then(function(data) {
                course.data.courseScore = data[0];
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
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', { id: this.renderOptions.id });
};
