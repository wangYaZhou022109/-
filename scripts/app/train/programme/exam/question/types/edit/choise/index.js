var _ = require('lodash/collection'),
    $ = require('jquery'),
    D = require('drizzlejs');

exports.items = {
    content: 'content',
    options: 'options',
    score: 'score'
};

exports.store = {
    models: {
        state: {
            mixin: {
                isRichText: function(content) {
                    return /<[^>]+>/g.test(content) || /&nbsp;/ig.test(content);
                }
            }
        },
        bottom: { data: {} },
        img: { url: '../system/file/upload' }
    },

    callbacks: {
        init: function(payload) {
            var data = this.models.state.data,
                bottom = this.models.bottom,
                i,
                question = payload.data,
                questionAttrs,
                view = this.module.items.content,
                isRichText;
            if (question) {
                questionAttrs = question.questionAttrs;
                bottom.data.score = question.score;
                if (!data.options) {
                    D.assign(data, question);
                    data.options = [];
                    for (i = 0; i < questionAttrs.length; i++) {
                        isRichText = this.models.state.isRichText(questionAttrs[i].value);
                        data.options.push({
                            content: questionAttrs[i].value,
                            isAnswer: Number(questionAttrs[i].type) === 0,
                            isRichText: isRichText
                        });
                    }
                }
                view.components.content.html(question.content);
            } else {
                data.options = [];
                for (i = 0; i < 4; i++) {
                    data.options.push({
                        content: '',
                        isAnswer: false,
                        isRichText: false
                    });
                }
                data.type = this.module.renderOptions.type;
            }
            data.multiple = payload.multiple;
            this.models.state.changed();
            bottom.changed();
        },

        addOption: function() {
            var options = this.models.state.data.options;

            if ((options.length + 1) > 10) {
                this.app.message.error('选项只能添加10个');
                return;
            }

            options.push({
                content: '',
                isAnswer: false,
                isRichText: false
            });

            this.models.state.changed();
        },

        changeContent: function(payload) {
            var options = this.models.state.data.options;
            options[Number(payload.index)].content = payload.content;
        },

        removeOption: function(payload) {
            var options = this.models.state.data.options;
            options.splice(Number(payload.index), 1);
            this.models.state.changed();
        },

        changeAnswer: function(payload) {
            var options = this.models.state.data.options,
                multiple = this.module.renderOptions.multiple,
                option = options[Number(payload.index)];
            if ($(this.module.items.options.$('content-' + payload.index)).val() === '') {
                if (!options[payload.index].content) {
                    this.app.message.error('不能选空选项为答案');
                    return;
                }
            }
            if (!multiple) {
                _.map(options, function(o) {
                    var item = o;
                    if (item.isAnswer) item.isAnswer = false;
                });
            }
            option.isAnswer = !option.isAnswer;
            this.models.state.changed();
        }
    }
};

exports.mixin = {
    getValue: function() {
        var view = this.items.options,
            options = this.store.models.state.data.options;

        if (!view.checkAnswer(options)) {
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

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
