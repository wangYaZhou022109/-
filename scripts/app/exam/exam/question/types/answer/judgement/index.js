var maps = require('./app/util/maps'),
    D = require('drizzlejs');

exports.items = {
    content: 'content',
    options: 'options'
};

exports.store = {
    models: {
        state: {
            data: {},
            mixin: {
                countGainScore: function(answer) {
                    if (!this.data.gainScore) {
                        if (answer.value.length > 0 && answer.value[0].value === this.data.questionAttrs[0].value) {
                            this.data.gainScore = this.data.score;
                        } else {
                            this.data.gainScore = 0;
                        }
                    }
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
            var question = payload.data,
                data = this.models.state.data = {
                    gainScore: 0,
                    errorRate: 0
                },
                judgement = maps.get('judgement'),
                types = maps.get('question-types'),
                difficultys = maps.get('question-difficultys');

            D.assign(data, question);

            if (question.questionAttrs.length > 0) {
                data.answer = judgement[Number(question.questionAttrs[0].value)].value;
            }

            data.type = types[Number(question.type) - 1].value;
            data.difficulty = difficultys[Number(question.difficulty) - 1].value;

            if (question.answerRecord) {
                data.gainScore = question.answerRecord.score;
            }

            data.detailMode = payload.mode;
            this.models.answer.init(payload.answer);
            this.models.state.countGainScore(payload.answer || { key: data.id, value: [] });
        },
        save: function() {
            var answer = this.models.answer.data,
                callback = this.module.renderOptions.callback;
            if (callback) callback(answer);
        }

    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
