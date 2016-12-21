var _ = require('lodash/collection'),
    dynamicCode = {
        1: 'pdf',
        5: 'mp3',
        6: 'video'
    };

exports.items = {
    player: 'player',
    'player-title': 'player-title',
    chapter: 'chapter',
    note: 'note'
};

exports.store = {
    models: {
        course: {
            url: '../course-study/course-front',
            mixin: {
                findSectionByIds: function(chapterId, sectionId) {
                    var chapter,
                        section;
                    chapter = _.find(this.data.courseChapters, {
                        id: chapterId
                    });
                    section = _.find(chapter.courseChapterSections, {
                        id: sectionId
                    });
                    return section;
                }
            }
        },
        note: {
            url: '../course-study/course-front/course-note'
        },
        notes: {
            url: '../course-study/course-front/course-notes'
        },
        courseChapterSection: {},
        courseSectionStudyProgress: {},
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var course = this.models.course,
                notes = this.models.notes;
            course.set({
                id: payload.courseId
            });
            notes.params = {
                courseId: payload.courseId
            };
            return this.chain(this.get(course), this.get(notes));
        },
        showSection: function(payload) {
            var chapterId = payload.chapterId,
                sectionId = payload.sectionId,
                course = this.models.course,
                sectionType;
            this.models.courseChapterSection.set(course.findSectionByIds(chapterId, sectionId));
            sectionType = this.models.courseChapterSection.sectionType;
            this.models.state.set({
                code: dynamicCode[sectionType]
            });
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
