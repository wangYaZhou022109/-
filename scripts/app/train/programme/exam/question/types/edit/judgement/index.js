var D = require('drizzlejs');

exports.items = {
    content: 'content',
    options: 'options',
    score: 'score'
};

exports.store = {
    models: {
        state: { data: {} },
        img: { url: '../system/file/upload' }
    },
    callbacks: {
        init: function(payload) {
            var data = this.models.state.data,
                question = payload.data,
                questionAttrs;
            if (question) {
                questionAttrs = question.questionAttrs;
                data.correct = questionAttrs[0].value === '1';
                data.error = questionAttrs[0].value === '0';
                D.assign(data, question);
            }
            data.type = this.module.renderOptions.type;
        }
    }
};

exports.mixin = {
    getValue: function() {
        var view = this.items.options;

        if (!view.checkAnswer()) {
            this.app.message.error('请选择正确或者错误');
            return false;
        }
        return view.getResult();
    },
    isValidate: function() {
        return this.items.content.validate() && this.items.score.validate();
    },
    clear: function() {
        this.renderOptions = {};
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
