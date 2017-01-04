exports.items = {
    top: 'top',
    main: 'main',
    side: 'side'
};

exports.store = {
    models: {
        exam: {
            url: '../exam/exam/exam-signup'
        },
        relatedExams: {
            url: '../exam/exam/related-exams'
        },
        relatedTopics: {
            url: '../exam/exam/related-topics'
        },
        relatedMembers: {
            url: '../exam/exam/related-members'
        },
        down: { url: '../human/file/download' },
    },
    callbacks: {
        init: function(payload) {
            this.models.exam.set(payload);
            this.get(this.models.exam);
            this.models.relatedExams.params = payload;
            this.get(this.models.relatedExams);
            this.models.relatedTopics.params = payload;
            this.get(this.models.relatedTopics);
            this.models.relatedMembers.params = payload;
            this.get(this.models.relatedMembers);
        },
        signUp: function() {
            var exam = this.models.exam;
            if (exam.data.signUp === null) {
                return this.put(exam);
            }
            return null;
        },
        revoke: function() {
            var me = this;
            return me.del(me.models.exam);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
