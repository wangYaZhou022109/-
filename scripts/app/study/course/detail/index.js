var _ = require('lodash/collection');
exports.items = {
    player: 'player',
    chapter: 'chapter',
    info: 'info',
    comment: 'comment',
    download: 'download',
    'releated-course': 'releated-course',
    'research-tips': '',
    'preview-pdf': '',
    'preview-img': '',
    'preview-video': '',
    'preview-audio': ''
};

exports.store = {
    models: {
        // 课程详情
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
                    return _.find(this.findAllSections(), { referenceId: referenceId }) || {};
                },
                findSectionsForType: function(type) {
                    return _.filter(this.findAllSections(), { sectionType: type });
                },
                findFirstSection: function() {
                    return this.findAllSections()[0];
                },
                // 是否是相同章或者下一章。
                isChapterSequence: function(beforeSectionId, currentSectionId) {
                    var beforeSection = this.findSection(beforeSectionId);
                    var currentSection = this.findSection(currentSectionId);
                    var nextIndex = 0;
                    if (beforeSection.chapterId === currentSection.chapterId) return true;

                    _.each(this.data.courseChapters, function(v, i) {
                        if (v.id === beforeSection.chapterId) {
                            nextIndex = i + 1;
                            return false;
                        }
                        return i;
                    });
                    // 如果前面学习的章节是最后一章 也直接为true
                    if (nextIndex === this.data.courseChapters.length) return true;

                    return this.data.courseChapters[nextIndex].id === currentSection.chapterId;
                },
                // 前面的章节是什么
                findBeforeSection: function(sectionId) {
                    var section = this.findSection(sectionId);
                    var chapter = this.findChapter(section.chapterId);
                    var nextIndex = 0;
                    _.each(chapter.courseChapterSections, function(v, i) {
                        if (v.id === sectionId) {
                            nextIndex = i - 1;
                            return false;
                        }
                        return v;
                    });
                    if (nextIndex === -1) return null;
                    return chapter.courseChapterSections[nextIndex];
                }
            }
        },
        // 课程进度
        progress: { url: '../course-study/course-front/course-progress',
            mixin: {
                findProgress: function(referenceId) {
                    return _.find(this.data, { sectionId: referenceId });
                }
            }
        },
        courseTopics: { url: '../course-study/topic' },
        topics: { url: '../system/topic/ids' },
        mediaProgress: { url: '../course-study/course-front/video-progress' },
        docProgress: { url: '../course-study/course-front/doc-progress' },
        // 注册课程
        register: { url: '../course-study/course-front/registerStudy' },
        collect: { url: '../system/collect' }, // 收藏
        courseRelated: { url: '../course-study/course-front/related' },
        preview: { url: '../human/file/preview' },
        download: { url: '../human/file/download' },
        attachment: { url: '../human/file' },
        score: { url: '../course-study/course-front/score' },
        state: {},
        playerState: {},
        researchActivity: { url: '../exam/research-activity/simple-data' }
    },
    callbacks: {
        init: function(payload) {
            // 初始化当前课程
            var course = this.models.course,
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

            // 查询标签
            this.chain(
                function() {
                    this.models.courseTopics.set({ id: payload.id });
                    return this.get(this.models.courseTopics);
                },
                function(data) {
                    var ids = _.map(data[0], 'topicId').join();
                    if (ids) {
                        this.models.topics.params = { ids: ids };
                        this.get(this.models.topics);
                    }
                }
            );

            return this.chain(
                this.get(course),
                function() {
                    return this.post(register);
                },
                function(data) {
                    var sectionId = data[0].currentSectionId;
                    if (sectionId) sectionId = course.findSectionForReferId(sectionId).id;
                    if (!sectionId) sectionId = course.findFirstSection().id;
                    progress.params = { ids: _.map(course.findAllSections(), 'referenceId').join() };
                    playerState.set({ id: payload.id, sectionId: sectionId }, true);
                    return this.get(progress);
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
        },
        getAttachment: function(payload) {
            var attachment = this.models.attachment;
            attachment.set({ id: payload.id });
            return this.get(attachment);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
