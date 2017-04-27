var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    content: 'content',
    options: 'options'
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
                    // questionAttrs 需要按照name排序，防止选项被打乱
                    questionAttrs = _.sortBy(questionAttrs, 'name');
                    for (i = 0; i < questionAttrs.length; i++) {
                        isRichText = this.models.state.isRichText(questionAttrs[i].value);
                        data.options.push({
                            content: questionAttrs[i].value,
                            score: questionAttrs[i].score || 0,
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
                        isRichText: false
                    });
                }
                data.type = this.module.renderOptions.type;
            }
            data.multiple = payload.multiple;
            data.mode = payload.mode;
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
        return this.items.content.validate();
    },
    clear: function() {
        this.renderOptions = {};
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
