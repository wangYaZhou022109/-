var maps = require('./app/util/maps'),
    D = require('drizzlejs');

exports.items = {
    content: 'content',
    options: 'options'
};

exports.store = {
    models: {
        state: {
            mixin: {
                getOption: function(index) {
                    return this.data.options[index];
                }
            }
        },
        answer: {
            data: {},
            mixin: {
                init: function(data) {
                    this.data = data || { key: '', value: [] };
                }
            }
        }
    },

    callbacks: {
        init: function(payload) {
            var data = this.models.state.data = {
                    options: [],
                    title: '单选题',
                    answer: '',
                    mutiple: false,
                    gainScore: 0,
                    errorRate: 0
                },
                i,
                question = payload.data,
                questionAttrs,
                difficultys = maps.get('question-difficultys'),
                types = maps.get('question-types');

            if (question) {
                D.assign(data, question);
                questionAttrs = question.questionAttrs;

                for (i = 0; i < questionAttrs.length; i++) {
                    data.options.push({
                        content: questionAttrs[i].value,
                        isAnswer: Number(questionAttrs[i].type) === 0,
                        isRichText: false,
                        mutiple: question.type === 2,
                        id: questionAttrs[i].id,
                        name: questionAttrs[i].name
                    });
                    if (Number(questionAttrs[i].type) === 0) {
                        data.answer += String.fromCharCode(i + 'A'.charCodeAt(0));
                    }
                }

                if (question.difficulty) {
                    data.difficulty = difficultys[Number(question.difficulty) - 1].value;
                }

                data.type = types[Number(question.type) - 1].value;
                if (Number(question.type) === 2) data.title = '多选题';

                if (question.answerRecord) {
                    data.gainScore = question.answerRecord.score;
                }

                data.detailMode = payload.mode === 2;
            }
            this.models.answer.init(payload.answer);
            this.models.state.changed();
        },
        save: function() {
            var answer = this.models.answer.data,
                callback = this.module.renderOptions.callback;
            if (callback) callback(answer);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
