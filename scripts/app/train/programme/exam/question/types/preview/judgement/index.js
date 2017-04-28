var maps = require('./app/util/maps'),
    D = require('drizzlejs');

exports.items = {
    content: 'content',
    options: 'options'
};

exports.store = {
    models: {
        state: {}
    },

    callbacks: {
        init: function(payload) {
            var question = payload.data,
                data = this.models.state.data = {
                    content: '',
                    answer: '',
                    score: 0,
                    type: 2,
                    difficulty: ''
                },
                judgement = maps.get('judgement'),
                types = maps.get('question-types'),
                difficultys = maps.get('question-difficultys');

            D.assign(data, question);

            data.answer = judgement[Number(question.questionAttrs[0].value)].value;
            data.type = types[Number(question.type) - 1].value;
            data.difficulty = difficultys[Number(question.difficulty) - 1].value;

            data.correct = data.questionAttrs[0].value === '1';
            data.error = data.questionAttrs[0].value === '0';

            this.models.state.changed();
        }

    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
