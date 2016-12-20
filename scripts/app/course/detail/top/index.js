exports.items = {
    player: 'player',
    'player-title': 'player-title',
    chapter: 'chapter',
    note: 'note'
};

exports.store = {
    models: {
        course: { url: '../course-study/course-front' },
        note: { url: '../course-study/course-front/course-note' },
        notes: { url: '../course-study/course-front/course-notes' }
    },
    callbacks: {
        init: function(payload) {
            var course = this.models.course,
                notes = this.models.notes;
            course.set({ id: payload.courseId });
            notes.params = { courseId: payload.courseId };
            return this.chain(this.get(course), this.get(notes));
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
