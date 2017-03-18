var maps = require('./app/util/maps'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    SINGLE = 1,
    MUTIPLE = 2;

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
                },
                countGainScore: function(answer) {
                    var type = this.module.renderOptions.data.type,
                        mutipleAnswer = [],
                        isCorrect;
                    if (!this.data.gainScore) {
                        if (type === SINGLE) {
                            if (_.find(this.data.options, ['name', answer.value[0].value]).isAnswer) {
                                this.data.gainScore = this.data.score;
                            } else {
                                this.data.gainScore = 0;
                            }
                        }

                        if (type === MUTIPLE) {
                            mutipleAnswer = _.filter(this.data.options, function(o) {
                                return o.isAnswer;
                            });
                            if (answer.value.length === mutipleAnswer.length) {
                                isCorrect = _.every(answer.value, function(a) {
                                    if (_.find(mutipleAnswer, ['name', a.value])) {
                                        return true;
                                    }
                                    return false;
                                });
                                this.data.gainScore = isCorrect ? this.data.score : 0;
                            } else {
                                this.data.gainScore = 0;
                            }
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

                data.detailMode = payload.mode;
            }
            this.models.answer.init(payload.answer);
            this.models.state.countGainScore(payload.answer || { key: data.id, value: [] });
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
