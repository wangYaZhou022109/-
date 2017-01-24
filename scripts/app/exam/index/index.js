exports.items = {
    top: 'top',
    main: 'main',
    side: 'side'
};

exports.store = {
    models: {
        exam: { url: '../exam/exam/exam-sign-up' },
        signUp: { url: '../exam/sign-up' },
        relatedExams: { url: '../exam/exam/related-exams' },
        relatedTopics: { url: '../exam/exam/related-topics' },
        relatedMembers: { url: '../exam/exam/related-members' },
        certificate: { url: '../system/certificate' },
        down: { url: '../human/file/download' }
    },
    callbacks: {
        init: function(payload) {
            var me = this;
            this.models.exam.set(payload);
            this.models.relatedExams.params = payload;
            this.models.relatedTopics.params = payload;
            this.models.relatedMembers.params = payload;

            return this.chain(me.get(me.models.exam), function() {
                me.models.certificate.set({ id: me.models.exam.data.certificateId });
                return me.get(me.models.certificate);
            }, [
                me.get(this.models.relatedExams),
                me.get(this.models.relatedTopics),
                me.get(this.models.relatedMembers)
            ]);
        },
        signUp: function() {
            this.models.signUp.set({ examId: this.models.exam.data.id });
            return this.post(this.models.signUp);
        },
        revoke: function() {
            var me = this;
            me.models.signUp.set({
                signUpIds: JSON.stringify([this.models.exam.data.signUp.id]),
                status: 4
            });
            return me.put(me.models.signUp);
        },
        removeSingUp: function() {
            delete this.models.exam.data.signUp;
            this.models.exam.changed();
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
