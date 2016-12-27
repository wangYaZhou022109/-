var _ = require('lodash/collection'),
    judgeSection = function(type) {
        if (type === 1 || type === 3 || type === 5 || type === 6) {
            return true;
        }
        return false;
    },
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
                studyProgress = {},
                notes = this.models.notes,
                state = this.models.state,
                currentSectionType;
            course.set(payload.course);
            notes.params = { courseId: course.data.id };
            studyProgress = course.data.studyProgress;
            state.data.code = 'default';
            // 首次进入并没有数据,只有第二次加载时才会有数据
            if (course.data.addType) {
                course.init();

                if (!studyProgress.currentChapterId) {
                    studyProgress.currentChapterId = course.data.courseChapters[0].id;
                    studyProgress.currentSectionId = course.data.courseChapters[0].courseChapterSections[0].id;
                } else if (!studyProgress.currentSectionId) {
                    // eslint-disable-next-line max-len
                    studyProgress.currentSectionId = course.data.courseChapters[studyProgress.currentChapterId].courseChapterSections[0].id;
                }
                currentSectionType = course.data.sections[studyProgress.currentSectionId].sectionType;

                if (judgeSection(currentSectionType)) {
                    // eslint-disable-next-line max-len
                    this.chain(this.module.dispatch('showSection', { sectionId: studyProgress.currentSectionId }), this.get(notes));
                } else {
                    this.get(notes);
                }
            }
        },
        initNotes: function() {
            var notes = this.models.notes;
            return this.get(notes);
        },
        showSection: function(payload) {
            var section = this.models.section,
                sectionProgress = this.models.sectionProgress,
                state = this.models.state,
                course = this.models.course;
            section.set(course.data.sections[payload.sectionId]);
            sectionProgress.set(course.data.progress[payload.sectionId]);
            state.data.code = dynamicCode[section.data.sectionType];
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
