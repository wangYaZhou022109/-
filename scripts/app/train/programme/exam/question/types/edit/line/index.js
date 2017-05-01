var D = require('drizzlejs');

exports.items = {
    content: 'content',
    options: 'options',
    score: 'score'
};

exports.store = {
    models: {
        state: {},
        img: { url: '../system/file/upload' }
    },

    callbacks: {
        init: function(payload) {
            var data = this.models.state.data = {
                    content: payload.content || '',
                    options: []
                },
                i,
                question = payload.data,
                questionAttrs;

            if (payload.options) {
                data.options = payload.options;
                return;
            }

            if (question) {
                questionAttrs = question.questionAttrs;
                for (i = 0; i < questionAttrs.length; i++) {
                    data.options.push({
                        content: questionAttrs[i].name,
                        match: questionAttrs[i].value,
                        isAnswer: false,
                        isRichText: false
                    });
                }
                D.assign(data, question);
            } else {
                for (i = 0; i < 4; i++) {
                    data.options.push({
                        content: '',
                        isAnswer: false,
                        isRichText: false
                    });
                }
                data.type = this.module.renderOptions.type;
            }
        },

        addOption: function() {
            var options = this.models.state.data.options;

            options.push({
                content: '',
                isAnswer: false,
                isRichText: false
            });

            this.models.state.changed();
        },

        removeOption: function(payload) {
            var options = this.models.state.data.options;
            options.splice(Number(payload.index), 1);
            this.models.state.changed();
        },

        changeContent: function(payload) {
            var options = this.models.state.data.options;
            options[Number(payload.index)].content = payload.content;
        },

    }
};

exports.mixin = {
    getValue: function() {
        var view = this.items.options,
            options = this.store.models.state.data.options;

        if (!view.checkAnswer(options)) {
            this.app.message.error('存在填写不完整的选项');
            return false;
        }
        return view.getResult(options);
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
