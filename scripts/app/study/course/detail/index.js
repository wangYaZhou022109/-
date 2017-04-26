var _ = require('lodash/collection');
exports.items = {
    player: 'player',
    chapter: 'chapter',
    info: 'info',
    comment: 'comment',
    download: 'download',
    'releated-course': 'releated-course',
    'research-tips': ''
};

exports.store = {
    models: {
        course: {
            url: '../course-study/course-front/info',
            mixin: {
                findAllSections: function() {
                    var duplicate = function(x) { return x.courseChapterSections; };
                    return _.flatMap(this.data.courseChapters, duplicate);
                },
                findChapter: function(chapterId) {
                    return _.find(this.data.courseChapters, { id: chapterId });
                },
                findSection: function(sectionId) {
                    return _.find(this.findAllSections(), { id: sectionId });
                },
                findSectionForReferId: function(referenceId) {
                    return _.find(this.findAllSections(), { referenceId: referenceId });
                },
                findSectionsForType: function(type) {
                    return _.filter(this.findAllSections(), { sectionType: type });
                },
                findFirstSection: function() {
                    return this.findAllSections()[0];
                }
            }
        },
        progress: { url: '../course-study/course-front/course-progress',
            mixin: {
                findProgress: function(sectionId) {
                    return _.find(this.data, { sectionId: sectionId });
                }
            }
        },
        mediaProgress: { url: '../course-study/course-front/video-progress' },
        docProgress: { url: '../course-study/course-front/doc-progress' },
        // 注册课程
        register: { url: '../course-study/course-front/registerStudy' },
        collect: { url: '../system/collect' }, // 收藏
        courseRelated: { url: '../course-study/course-front/related' },
        download: { url: '../human/file/download' },
        score: { url: '../course-study/course-front/score' },
        state: {},
        playerState: {},
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
                playerState = this.models.playerState,
                register = this.models.register,
                progress = this.models.progress;
            course.set(payload);
            courseRelated.params = { limit: 2, id: payload.id };
            collect.params = { businessId: payload.id };
            register.set({ courseId: payload.id });

            this.get(courseRelated);
            this.get(collect);
            this.post(register);

            return this.chain([this.get(course), this.post(register)]).then(function(data) {
                var sectionId = data[1][0].currentSectionId;
                if (sectionId) sectionId = course.findSectionForReferId(sectionId).id;
                if (!sectionId) sectionId = course.findFirstSection().id;

                progress.params = { ids: _.map(course.findAllSections(), 'referenceId').join() };

                return me.chain(
                    [me.get(progress),
                    (function() {
                        var researchIdArr = _.map(course.findSectionsForType(12), 'resourceId') || [];
                        var researchQueIdArr = _.map(course.findSectionsForType(13), 'resourceId') || [];
                        var researchIds = researchIdArr.concat(researchQueIdArr).join();
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
                    }())],
                    playerState.set({ id: payload.id, sectionId: sectionId }, true)
                );
            });
        },
        mediaProgress: function(payload) {
            var model = this.models.mediaProgress;
            model.set(payload);
            return this.post(model);
        },
        docProgress: function(payload) {
            var model = this.models.docProgress;
            model.set(payload);
            return this.post(model);
        },
        updateProgress: function() {
            var progress = this.models.progress,
                course = this.models.course;
            progress.params = { ids: _.map(course.findAllSections(), 'referenceId').join() };
            return this.get(progress);
        },
        showSection: function(payload) {
            var playerState = this.models.playerState;
            playerState.data.sectionId = payload.id;
            playerState.changed();
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
        selectCourseRelated: function() {
            var model = this.models.courseRelated;
            model.params = { id: this.models.course.data.id, limit: 2 };
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
