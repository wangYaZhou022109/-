exports.items = {
    main: 'main'
};

exports.title = '考试须知';

exports.store = {
    models: {
        exam: {
            url: '../exam/exam/front/user-record/'
        },
        signUp: { url: '../exam/sign-up' },

    },
    callbacks: {
        init: function(payload) {
            if (payload.examId) {
                this.models.exam.set({ id: payload.examId });
                return this.get(this.models.exam, { loading: true });
            }
            return '';
        },
        cancel: function() {
            var me = this,
                exam = this.models.exam;
            this.models.signUp.set({ id: exam.data.signUp.id });
            return this.del(this.models.signUp, { loading: true }).then(function() {
                return me.get(me.models.exam);
            });
        },
        signUp: function(payload) {
            var me = this;
            this.models.signUp.set(payload);
            return this.post(this.models.signUp, { loading: true }).then(function() {
                return me.get(me.models.exam);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.afterClose = function() {
    if (this.renderOptions.toActivityHome) {
        this.app.navigate('activity/index');
    }
};

