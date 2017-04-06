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
            data.waitingCheck = payload.waitingCheck;
        },
        waitingCheck: function(payload) {
            if (this.models.state.data.waitingCheck) {
                this.models.state.data.waitingCheck = undefined;
            } else {
                this.models.state.data.waitingCheck = payload;
            }
            this.module.renderOptions.callback.waitingCheck(payload);
            this.models.state.changed();
        },
        correct: function(payload) {
            this.module.renderOptions.callback.correct(payload);
        },
        saveCorrect: function(payload) {
            var me = this;
            this.models.state.data.correct = payload;
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
