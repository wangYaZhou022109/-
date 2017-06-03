var D = require('drizzlejs');
exports.items = {
    head: 'head',
    side: 'side',
    main: 'main'
};

exports.store = {
    models: {
        task: {
            url: '../course-study/study-task'
        },
        sectionStudyProgress: {
            url: '../course-study/course-study-progress/section-progress'
        },
        state: { data: { flag: 'desc' } },
        preview: {
            url: '../human/file/preview'
        },
        download: {
            url: '../human/file/download'
        },
        audit: {
            url: '../course-study/course-study-progress/audit-progress'
        }
    },
    callbacks: {
        init: function(payload) {
            var progress = this.models.sectionStudyProgress,
                task = this.models.task,
                me = this;
            progress.clear();
            progress.params.sectionProgressId = payload.id;
            return this.chain(
                function() {
                    return me.get(progress);
                },
                function(data) {
                    task.set({ id: data[0].courseChapterSection.resourceId });
                    return me.get(task);
                }
            );
        },
        saveAudit: function(payload) {
            this.models.audit.set(payload);
            return this.save(this.models.audit);
        },
        updateState: function(payload) {
            var state = this.models.state;
            D.assign(state.data || {}, payload);
            state.changed();
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
