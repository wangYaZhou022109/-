var maps = require('./app/util/maps');

exports.items = {
    content: 'content',
    options: 'options'
};

exports.store = {
    models: {
        state: { data: {} }
    },

    callbacks: {
        init: function(payload) {
            var question = payload.data,
                questionAttrs = question.questionAttrs,
                types = maps.get('question-types'),
                difficultys = maps.get('question-difficultys'),
                data = this.models.state.data = {
                    answer: ''
                },
                items = [],
                matchs = [],
                i = 0,
                code;

            data.content = question.content;
            data.score = question.score;
            data.type = types[Number(question.type) - 1].value;
            data.difficulty = difficultys[Number(question.difficulty) - 1].value;

            for (i; i < questionAttrs.length; i++) {
                code = String.fromCharCode(i + 'A'.charCodeAt(0));
                items.push({ content: questionAttrs[i].name, i: i, code: code });
                matchs.push({ content: questionAttrs[i].value, i: i, code: code });
                data.answer += questionAttrs[i].name + '-' + questionAttrs[i].value + '';
            }

            data.items = items;
            data.matchs = matchs;
            this.models.state.changed();
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
