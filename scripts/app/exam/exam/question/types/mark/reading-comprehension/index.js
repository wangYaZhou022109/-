var maps = require('./app/util/maps'),
    _ = require('lodash/collection'),
    D = require('drizzlejs');

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
        goal: {
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
                getGoal: function(id) {
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
            this.models.sub.clear();
            D.assign(data, question);
            data.type = types[Number(question.type) - 1].value;
            data.difficulty = difficultys[Number(question.difficulty) - 1].value;
            this.models.sub.data.questions = _.filter(question.subs, ['type', 5]);
            this.models.goal.init(payload.goal);
        },
        save: function() {
            var goal = this.models.goal.data,
                callback = this.module.renderOptions.callback;
            if (callback) callback(goal);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
