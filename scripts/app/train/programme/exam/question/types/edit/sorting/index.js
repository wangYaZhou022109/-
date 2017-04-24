var D = require('drizzlejs'),
    _ = require('lodash/collection');

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
                    return /<[^>]+>/g.test(content);
                }
            }
        },
        img: { url: '../system/file/upload' }
    },

    callbacks: {
        init: function(payload) {
            var data = this.models.state.data,
                i,
                question = payload.data,
                questionAttrs,
                code,
                answer,
                isRichText,
                content = this.module.items.content;
            if (payload.options) {
                data.options = payload.options;
                return;
            }
            if (question) {
                answer = _.find(question.questionAttrs, ['type', '0']).value;
                questionAttrs = _.filter(question.questionAttrs, function(qr) {
                    return Number(qr.type) !== 0;
                });
                if (!data.options) {
                    D.assign(data, question);
                    data.options = [];
                    for (i = 0; i < questionAttrs.length; i++) {
                        isRichText = this.models.state.isRichText(questionAttrs[i].value);
                        code = String.fromCharCode(i + 'A'.charCodeAt(0));
                        data.options.push({
                            content: questionAttrs[i].value,
                            isRichText: isRichText,
                            name: questionAttrs[i].name,
                            code: code,
                            i: i
                        });
                        code = String.fromCharCode(i + 'A'.charCodeAt(0));
                        answer = answer.replace(questionAttrs[i].name, code);
                    }
                }
                data.answer = answer.split('|').join('');
                content.components.content.html(question.content);
            } else {
                data.options = [];
                for (i = 0; i < 4; i++) {
                    code = String.fromCharCode(i + 'A'.charCodeAt(0));
                    data.options.push({
                        content: '',
                        isRichText: false,
                        name: i,
                        code: code,
                        i: i
                    });
                }
            }
            this.models.state.changed();
        },

        addOption: function() {
            var options = this.models.state.data.options;

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
            this.app.message.error('答案的字母与排序项数目不一致');
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
