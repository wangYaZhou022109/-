var maps = require('./app/util/maps'),
    _ = require('lodash/collection');

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
                data = this.models.state.data = {
                    content: '',
                    score: 0,
                    type: 8,
                    difficulty: '',
                    options: []
                },
                types = maps.get('question-types'),
                difficultys = maps.get('question-difficultys'),
                attrs = question.questionAttrs,
                i = 0,
                code,
                answer = '';

            data.content = question.content;
            data.score = question.score;
            data.type = _.find(types, ['key', question.type.toString()]).value;
            data.difficulty = difficultys[Number(question.difficulty) - 1].value;
            data.options = [];

            answer = _.find(_.map(attrs, function(a) {
                var aa = a;
                aa.type = Number(aa.type);
                return aa;
            }), ['type', 0]).value;

            attrs = _.filter(attrs, function(a) {
                return Number(a.type) !== 0;
            });

            for (i; i < attrs.length; i++) {
                code = String.fromCharCode(i + 'A'.charCodeAt(0));
                data.options.push({ content: attrs[i].value, code: code, i: i });
                answer = answer.replace(
                    attrs[i].name + '|',
                    String.fromCharCode(Number(attrs[i].name) + 'A'.charCodeAt(0))
                );
            }
            data.answer = answer.split('|').join('');
            this.models.state.changed();
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
