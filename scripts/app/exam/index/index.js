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
        down: { url: '../human/file/download' },
    },
    callbacks: {
        init: function(payload) {
            this.models.exam.set(payload);
            this.get(this.models.exam);
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
