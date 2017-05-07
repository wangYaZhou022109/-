var _ = require('lodash/collection');
exports.items = {
    pannel: 'pannel',
    // 'exam-tips': '',
    'research-tips': '',
    'activity/index/exam-prompt': { isModule: true }
};

exports.store = {
    models: {
        region: {},
        subject: {
            data: {},
            mixin: {
                findAllSections: function() {
                    var duplicate = function(x) { return x.courseChapterSections; };
                    return _.flatMap(this.data.courseChapters, duplicate);
                },
                findSectionsForType: function(type) {
                    return _.filter(this.findAllSections(), { sectionType: type });
                },
                findSectionsForId: function(id) {
                    var sections = _.filter(this.findAllSections(), { id: id }) || [];
                    return sections[0] || {};
                },
                setSectionResource: function(resources) {
                    _.map(this.data.courseChapters, function(courseChapter) {
                        return _.map(courseChapter.courseChapterSections, function(courseChapterSection) {
                            var section = courseChapterSection,
                                resource = _.find(resources, { id: section.resourceId });
                            if (resource) {
                                section.resource = resource;
                            }
                            return section;
                        });
                    });
                    this.changed();
                }
            }
        },
        state: { data: {} },
        updateProgress: {
            url: '../course-study/course-front/url-progress'
        },
        researchActivity: {
            url: '../exam/research-activity'
        },
        examStatus: { url: '../exam/exam/status' },
        researchStatus: { url: '../exam/research-activity/status' },
        exams: { url: '../exam/exam/basic-by-ids' }
    },
    callbacks: {
        init: function(options) {
            var subject = options.subject,
                studyProgress = subject.studyProgress,
                courseChapters = subject.courseChapters,
                courseChapterSections = courseChapters[0].courseChapterSections,
                exams = this.models.exams,
                examIds,
                me = this;
            if (studyProgress && (!studyProgress.currentChapterId || !studyProgress.currentSectionId)) {
                studyProgress.currentChapterId = courseChapters[0].id;
                studyProgress.currentSectionId = courseChapterSections[0].id;
                subject.studyProgress = studyProgress;
            }
            this.models.region.set(options.region);
            this.models.subject.set(subject);
            this.models.state.set(options.state || {});
            // this.chain([(function() {
            //     var researchIdArr = _.map(me.models.subject.findSectionsForType(12), 'resourceId') || [];
            //     var researchQueIdArr = _.map(me.models.subject.findSectionsForType(13), 'resourceId') || [];
            //     var researchIds = researchIdArr.concat(researchQueIdArr).join();
            //     if (researchIds) {
            //         me.models.researchStatus.params = { researchIds: researchIds };
            //         me.get(me.models.researchStatus).then(function(data) {
            //             subject.courseChapters = initProgress(subject.courseChapters, 12, data[0]);
            //             me.models.subject.set(subject);
            //             me.models.subject.changed();
            //         });
            //     }
            // }()), (function() {
            //     var examIds = _.map(me.models.subject.findSectionsForType(9), 'resourceId').join();
            //     if (examIds) {
            //         me.models.examStatus.params = { examIds: examIds };
            //         me.get(me.models.examStatus).then(function(data) {
            //             subject.courseChapters = initProgress(subject.courseChapters, 9, data[0]);
            //             me.models.subject.set(subject);
            //             me.models.subject.changed();
            //         });
            //     }
            // }())], true);
            examIds = _.map(this.models.subject.findSectionsForType(9), 'resourceId').join();
            if (examIds) {
                exams.params = { ids: examIds };
                me.get(exams).then(function(data) {
                    me.models.subject.setSectionResource(data[0]);
                });
            }
        },
        updateProgress: function(payload) {
            var model = this.models.updateProgress;
            model.set(payload);
            return this.post(model);
        },
        getResearchById: function(payload) {
            var model = this.models.researchActivity;
            model.set({ id: payload.id });
            return this.get(model);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};

// initProgress = function(courseChapters, sectionType, businessProgress) {
//     _.map(courseChapters, function(chapter) {
//         _.map(chapter.courseChapterSections, function(section) {
//             var sec = section,
//                 status;
//             if (sec.sectionType === sectionType) {
//                 if (sectionType === 9) {
//                     status = _.find(businessProgress, { examId: sec.resourceId });
//                     if (status && status.status === 2) {
//                         sec.progress = D.assign(sec.progress || {}, { finishStatus: 1 });
//                     }
//                 } else if (sec.sectionType === 12) {
//                     status = _.find(businessProgress, { researchQuestionaryId: sec.resourceId });
//                     if (status && status.status === 1) {
//                         sec.progress = D.assign(sec.progress || {}, { finishStatus: 2 });
//                     }
//                 }
//             }
//             return sec;
//         });
//         return chapter.courseChapterSections;
//     });
//     return courseChapters;
// };
