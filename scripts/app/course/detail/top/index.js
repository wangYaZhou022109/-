var _ = require('lodash/collection'),
    dynamicCode = {
        1: 'pdf',
        5: 'audio',
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
        section: {},
        sectionProgress: {},
        note: { url: '../course-study/course-front/course-note' },
        notes: { url: '../course-study/course-front/course-notes' },
        register: { url: '../course-study/course-front/register' },
        collect: { url: '../system/collect' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var course = this.models.course,
                notes = this.models.notes,
                state = this.models.state;
            course.set({
                id: payload.courseId
            });
            notes.params = {
                courseId: payload.courseId
            };
            state.data.code = 'audio';
            return this.chain(this.get(course), this.get(notes));
        },
        initNotes: function() {
            var notes = this.models.notes;
            return this.get(notes);
        },
        showSection: function(payload) {
            var section = this.models.section,
                state = this.models.state,
                chapterId = payload.chapterId,
                sectionId = payload.sectionId,
                course = this.models.course,
                sectionType;
            section.set(course.findSectionByIds(chapterId, sectionId));
            sectionType = this.models.courseChapterSection.data.sectionType;
            this.models.state.set({
                code: dynamicCode[sectionType]
            });
            state.changed();
        },
        register: function() {
            var courseId = this.models.course.data.id,
                register = this.models.register;
            register.data = { courseId: courseId };
            return this.save(register);
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
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
