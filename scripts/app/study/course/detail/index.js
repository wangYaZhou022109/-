var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    util = require('./app/study/course/course-util');
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
        score: {
            url: '../course-study/course-front/score',
            data: {},
            mixin: {
                init: function(data) {
                    var course = data,
                        avgScore;
                    if (course) {
                        // 判断当前用户是否评分
                        if (course.courseScore) {
                            this.data.hasScore = true;
                        }
                        if (course.avgScore) {
                            this.data.scorePercent = course.avgScore;
                            avgScore = course.avgScore / 10;
                            this.data.avgScore = avgScore.toFixed(1);
                        } else {
                            this.data.scorePercent = 0;
                        }
                        this.changed();
                    }
                }
            }
        },
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
                    if (c[0].studyProgress && c[0].studyProgress.currentSectionId) {
                        sectionId = c[0].studyProgress.currentSectionId;
                    }
                    state.set({ id: payload.id, sectionId: sectionId, register: c.register }, true);
                }),
                this.get(courseRelated),
                this.get(lastestUser),
                this.get(collect),
                this.get(notes)
            ]);
        },
        initScore: function(payload) {
            // 初始化评分
            var score = this.models.score,
                avgScore;
            score.clear();
            score.data.hasScore = true;
            score.data.scorePercent = payload.avgScore;
            avgScore = payload.avgScore / 10;
            score.data.avgScore = avgScore.toFixed(1);
            score.changed();
        },
        refresh: function(payload) {
            var me = this,
                course = me.models.course,
                state = me.models.state,
                studyProgress,
                currentSectionType;
            course.set(payload);
            course.init();
            studyProgress = course.data.studyProgress || {};

            if (!studyProgress.currentChapterId) {
                studyProgress.currentChapterId = course.data.courseChapters[0].id;
                studyProgress.currentSectionId = course.data.courseChapters[0].courseChapterSections[0].id;
            } else if (!studyProgress.currentSectionId) {
                studyProgress.currentSectionId = course.data.courseChapters[studyProgress.currentChapterId]
                .courseChapterSections[0].id;
            }
            course.data.studyProgress = studyProgress;
            currentSectionType = course.data.sections[studyProgress.currentSectionId].sectionType;

            if (course.data.register) {
                if (util.judgeSection(currentSectionType)) {
                    me.module.dispatch('showSection', { sectionId: studyProgress.currentSectionId });
                    course.changed();
                } else {
                    state.data.code = 'default';
                    state.changed();
                }
            } else {
                state.data.code = 'default';
                state.changed();
            }
        },
        initCourse: function() {
            var course = this.models.course,
                state = this.models.state;
            course.set({ id: state.data.id });
            return this.get(course);
        },
        showSection: function(payload) {
            var state = this.models.state;
            state.data.sectionId = payload.sectionId;
            state.changed();
        },
        collect: function() {
            var courseId = this.models.course.data.id,
                courseName = this.models.course.data.name,
                collect = this.models.collect;
            collect.clear();
            collect.data.businessId = courseId;
            collect.data.businessType = 1;
            collect.data.collectName = courseName;
            return this.save(collect);
        },
        cancelCollect: function(payload) {
            var collect = this.models.collect;
            collect.set(payload);
            return this.del(collect);
        },
        addNote: function(payload) {
            var note = this.models.note;
            note.set(payload);
            return this.save(note);
        },
        removeNote: function(payload) {
            var note = this.models.note;
            note.set(payload);
            return this.del(note);
        },
        updateNote: function(payload) {
            var note = this.models.note;
            note.set(payload);
            return this.save(note);
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
            return this.save(score);
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
                this.post(model), [
                    function() {
                        // this.app.message.alert('注册完毕，开始刷新课程');
                        course.get({ id: state.data.id }); // 刷新课程
                        this.get(course);
                    },
                    function() {
                        // this.app.message.alert('注册完毕，开始播放课程');
                        D.assign(state.data, { sectionId: sectionId, register: true });
                        state.changed(); // 改变播放
                    }
                ]
            );
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', { id: this.renderOptions.id });
};
