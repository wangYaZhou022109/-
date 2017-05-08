var _ = require('lodash/collection');
exports.items = {
    pannel: 'pannel',
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
        exams: { url: '../exam/exam/basic-by-ids' },
        gensees: { url: '../course-study/gensee/front/find-by-ids' }
    },
    callbacks: {
        init: function(options) {
            var subject = options.subject,
                exams = this.models.exams,
                gensees = this.models.gensees,
                me = this;
            this.models.region.set(options.region);
            this.models.subject.set(subject);
            this.models.state.set(options.state || {});
            this.chain([(function() {
                var examIds = _.map(me.models.subject.findSectionsForType(9), 'resourceId').join();
                if (examIds) {
                    exams.params = { ids: examIds };
                    me.get(exams).then(function(data) {
                        me.models.subject.setSectionResource(data[0]);
                    });
                }
            }()), (function() {
                var genseeIds = _.map(me.models.subject.findSectionsForType(14), 'resourceId').join();
                if (genseeIds) {
                    gensees.params = { ids: genseeIds };
                    me.get(gensees).then(function(data) {
                        me.models.subject.setSectionResource(data[0]);
                    });
                }
            }())], true);
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
