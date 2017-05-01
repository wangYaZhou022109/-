var maps = require('./app/util/maps'),
    _ = require('lodash/collection');

exports.items = {
    content: 'content',
    score: 'score',
    subs: 'subs'
};

exports.store = {
    models: {
        state: {},
        sub: {
            data: {},
            mixin: {
                getQuestionById: function(data) {
                    return _.find(this.data.questions, ['id', data]);
                }
            }
        }
    },

    callbacks: {
        init: function(payload) {
            var question = payload.data,
                data = this.models.state.data,
                types = maps.get('question-types'),
                difficultys = maps.get('question-difficultys');

            this.models.sub.clear();
            data.content = question.content;
            data.score = question.score;
            data.type = types[Number(question.type) - 1].value;
            data.difficulty = difficultys[Number(question.difficulty) - 1].value;
            this.models.sub.data.questions = question.subs;
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
