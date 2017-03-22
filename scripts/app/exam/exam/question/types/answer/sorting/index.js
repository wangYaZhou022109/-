var maps = require('./app/util/maps'),
    _ = require('lodash/collection'),
    D = require('drizzlejs');

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
                types = maps.get('question-types'),
                difficultys = maps.get('question-difficultys'),
                attrs = question.questionAttrs,
                i = 0,
                code,
                answer = '';
            D.assign(data, question);
            data.type = types[Number(question.type) - 1].value;
            data.difficulty = difficultys[Number(question.difficulty) - 1].value;
            data.options = [];

            if (_.find(attrs, ['type', '0'])) {
                answer = _.find(attrs, ['type', '0']).value;
            }

            attrs = _.filter(attrs, function(a) {
                return Number(a.type) !== 0;
            });

            for (i; i < attrs.length; i++) {
                code = String.fromCharCode(i + 'A'.charCodeAt(0));
                data.options.push({ content: attrs[i].value, name: attrs[i].name, code: code, i: i });
                answer = answer.replace(
                    Number(attrs[i].name) + '|',
                    String.fromCharCode(Number(attrs[i].name) + 'A'.charCodeAt(0))
                );
            }

            if (answer !== '') {
                data.answer = answer.split('|').join('');
            }

            if (question.answerRecord) {
                data.gainScore = question.answerRecord.score;
            }

            data.detailMode = payload.mode;
            this.models.answer.init(payload.answer);
        },
        save: function() {
            var data = this.models.answer.data,
                callback = this.module.renderOptions.callback;
            if (callback) callback(data);
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
