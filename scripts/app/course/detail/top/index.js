var _ = require('lodash/collection'),
    dynamicCode = {
        1: 'pdf',
        2: 'survey',
        3: 'url',
        4: 'scorm',
        5: 'audio',
        6: 'video',
        7: 'epub',
        8: 'task',
        9: 'exam',
        10: 'course',
        11: 'face',
        12: 'evaluate'
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
                init: function() {
                    var chapters = {},
                        sections = {},
                        progress = {};
                    _.forEach(this.data.courseChapters, function(item) {
                        chapters[item.id] = item;
                        _.forEach(item.courseChapterSections, function(r) {
                            sections[r.id] = r;
                            progress[r.id] = r.progress;
                        });
                    });
                    this.data.chapters = chapters;
                    this.data.sections = sections;
                    this.data.progress = progress;
                }
            }
        },
        section: {},
        sectionProgress: {},
        note: { url: '../course-study/course-front/course-note' },
        notes: { url: '../course-study/course-front/course-notes' },
        collect: { url: '../system/collect' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var course = this.models.course,
                notes = this.models.notes,
                state = this.models.state;
            course.set({ id: payload.courseId });
            notes.params = { courseId: payload.courseId };
            return this.chain(this.get(course).then(function() {
                if (!course.data.owned) {
                    this.app.message.error('您没有该课程的学习权限');
                } else {
                    course.init();
                    state.data.code = 'default';
                    state.data.ready = true;
                    state.changed();
                }
            }), this.get(notes));
        },
        initNotes: function() {
            var notes = this.models.notes;
            return this.get(notes);
        },
        showSection: function(payload) {
            var section = this.models.section,
                state = this.models.state,
                course = this.models.course;
            section.set(course.data.sections[payload.sectionId]);
            state.set({ code: dynamicCode[section.data.sectionType] });
            state.data.ready = true;
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
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
