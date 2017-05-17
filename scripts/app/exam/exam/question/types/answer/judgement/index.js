var maps = require('./app/util/maps'),
    D = require('drizzlejs'),
    NO_DETAIL_MODE = -1;

exports.items = {
    content: 'content',
    options: 'options'
};

exports.store = {
    models: {
        state: {
            data: {}
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

            if (payload.mode !== NO_DETAIL_MODE && question.questionAttrs.length > 0) {
                data.answer = judgement[Number(question.questionAttrs[0].value)].value;
            }

            data.type = types[Number(question.type) - 1].value;
            data.difficulty = difficultys[Number(question.difficulty) - 1].value;

            if (!data.gainScore && question.answerRecord) {
                data.gainScore = question.answerRecord.score;
            }

            data.detailMode = payload.mode;
            this.models.answer.init(payload.answer);
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
