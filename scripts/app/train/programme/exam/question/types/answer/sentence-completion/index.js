var maps = require('./app/util/maps'),
    D = require('drizzlejs');

exports.items = {
    content: 'content',
    options: 'options'
};

exports.store = {
    models: {
        state: {},
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
                types = maps.get('question-types'),
                difficultys = maps.get('question-difficultys');
            D.assign(data, question);
            data.answer = question.questionAttrs[0].value;
            data.type = types[Number(question.type) - 1].value;
            data.difficulty = difficultys[Number(question.difficulty) - 1].value;
            data.detailMode = payload.mode;
            if (question.answerRecord) {
                data.gainScore = question.answerRecord.score;
            }
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
