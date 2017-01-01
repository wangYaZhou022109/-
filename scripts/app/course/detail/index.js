var _ = require('lodash/collection'),
    judgeSection = function(type) {
        if (type === 1 || type === 5 || type === 6) {
            return true;
        }
        return false;
    },
    sectionCode = {
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
        courseRelated: {
            url: '../course-study/course-front/related',
            type: 'pageable',
            pageSize: 2,
            root: 'items'
        },
        download: {
            url: '../human/file/download'
        },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var me = this,
                course = me.models.course,
                courseRelated = me.models.courseRelated,
                collect = me.models.collect,
                notes = me.models.notes;
            course.set(payload);
            notes.params.courseId = payload.id;
            courseRelated.params.id = payload.id;
            collect.params.businessId = payload.id;
            return me.chain(me.get(course).then(function() {
                me.module.dispatch('refresh', course.data);
            }, function() {
                history.back(-1);
            }), me.get(notes), me.get(courseRelated), me.get(collect));
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
                // eslint-disable-next-line max-len
                studyProgress.currentSectionId = course.data.courseChapters[studyProgress.currentChapterId].courseChapterSections[0].id;
            }
            course.data.studyProgress = studyProgress;
            currentSectionType = course.data.sections[studyProgress.currentSectionId].sectionType;

            if (course.data.register) {
                if (judgeSection(currentSectionType)) {
                    me.module.dispatch('showSection', { sectionId: studyProgress.currentSectionId });
                } else {
                    state.data.code = 'default';
                    state.changed();
                }
            } else {
                state.data.code = 'default';
                state.changed();
            }
        },
        initNotes: function() {
            var notes = this.models.notes;
            return this.get(notes);
        },
        initCollect: function(payload) {
            var collect = this.models.collect;
            collect.clear();
            collect.params.businessId = payload.courseId;
            return this.get(collect);
        },
        showSection: function(payload) {
            var section = this.models.section,
                sectionProgress = this.models.sectionProgress,
                state = this.models.state,
                course = this.models.course;
            section.set(course.data.sections[payload.sectionId]);
            sectionProgress.set(course.data.progress[payload.sectionId]);
            state.data.code = sectionCode[section.data.sectionType];
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
exports.afterRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
