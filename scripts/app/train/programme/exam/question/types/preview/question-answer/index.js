var maps = require('./app/util/maps');

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
                data = this.models.state.data,
                types = maps.get('question-types'),
                difficultys = maps.get('question-difficultys');

            data.content = question.content;
            data.answer = question.questionAttrs[0].value;
            data.score = question.score;
            data.type = types[Number(question.type) - 1].value;
            if (question.difficulty) {
                data.difficulty = difficultys[Number(question.difficulty) - 1].value;
            }
            this.models.state.changed();
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
