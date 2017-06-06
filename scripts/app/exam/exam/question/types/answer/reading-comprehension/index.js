var maps = require('./app/util/maps'),
    _ = require('lodash/collection'),
    D = require('drizzlejs'),
    sortByQuestionType;

exports.items = {
    content: 'content',
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
        },
        answer: {
            data: {},
            mixin: {
                init: function(data) {
                    this.data = data || {
                        key: this.store.models.state.data.id,
                        type: 6,
                        value: []
                    };
                },
                save: function(data) {
                    var value = this.data.value,
                        temp;
                    temp = _.reject(value, ['key', data.key]);
                    temp.push(data);
                    this.data.value = temp;
                },
                getAnswer: function(id) {
                    var value = this.data.value;
                    return _.find(value, ['key', id]);
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
            D.assign(data, question);
            data.type = types[Number(question.type) - 1].value;
            data.difficulty = difficultys[Number(question.difficulty) - 1].value;
            data.detailMode = payload.mode;
            data.subMode = payload.subMode;
            this.models.sub.data.questions = sortByQuestionType(question.subs);
            this.models.answer.init(payload.answer);
        },
        save: function() {
            var answer = this.models.answer.data,
                callback = this.module.renderOptions.callback;
            if (callback) callback(D.assign(answer, { type: 6 }));
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

sortByQuestionType = function(subs) {
    return _.orderBy(subs, ['createTime', 'type'], ['asc', 'asc']);
};
