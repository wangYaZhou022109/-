exports.items = {
    top: 'top',
    main: 'main',
    side: 'side'
};

exports.store = {
    models: {
        exam: {
            url: '../exam/exam'
        },
        signup: {
            url: '../exam/sign-up/detail'
        }
    },
    callbacks: {
        init: function(payload) {
            this.models.exam.set(payload);
            this.get(this.models.exam);
            this.models.signup.params = { examId: payload.id };
            this.get(this.models.signup);
        },
        signup: function() {
            var me = this,
                examId = me.models.exam.data.id;
            me.models.signup.params = { examId: examId };
            return me.save(me.models.signup);
        },
        revoke: function() {
            var me = this;
            return me.del(me.models.signup);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
