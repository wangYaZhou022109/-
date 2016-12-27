exports.items = {
    main: 'main',
    correct: ''
};

exports.store = {
    models: {
        state: {},
        correct: {
            url: '../exam/question-recovery/submit'
        }
    },
    callbacks: {
        init: function(payload) {
            var data = this.models.state.data;
            data.id = payload.questionId;
            data.isCollect = payload.isCollect || false;
            data.correct = payload.correct;
        },
        collect: function(payload) {
            this.module.renderOptions.callback.collect(payload);
        },
        correct: function(payload) {
            this.module.renderOptions.callback.correct(payload);
        },
        saveCorrect: function(payload) {
            var me = this;
            this.models.correct.set(payload);
            return this.post(this.models.correct).then(function() {
                me.app.message.success('提交错误成功');
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
