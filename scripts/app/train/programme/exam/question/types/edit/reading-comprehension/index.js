var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.items = {
    content: 'content',
    modal: '',
    score: 'score',
    subs: 'subs'
};

exports.store = {
    models: {
        img: { url: '../system/file/upload' },
        state: { data: {} },
        sub: {
            mixin: {
                getQuestionById: function(data) {
                    return _.find(this.data.questions, ['id', data]);
                },
                sumScore: function() {
                    var scores = _.map(this.data.questions, function(q) {
                            return q.score;
                        }),
                        data = this.module.store.models.state.data;
                    data.score = _.reduce(scores, function(sum, n) {
                        return Number(sum) + Number(n);
                    }, 0);
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            var question = payload.data,
                data = this.models.state.data,
                view = this.module.items.content;

            this.models.sub.data = { questions: [] };
            if (question) {
                this.models.sub.data.questions = question.subs;
                D.assign(data, question);
                view.components.content.html(question.content);
            }
            this.models.sub.changed();
            this.models.state.changed();
        },
        refreshSub: function() {
            this.models.sub.sumScore();
            this.models.state.changed();
            this.models.sub.changed();
        }
    }
};

exports.mixin = {
    getValue: function() {
        var data = {},
            contentItem = this.items.content,
            scoreItem = this.items.score,
            state = this.store.models.state.data;
        data.questionAttrs = this.store.models.sub.data.questions;
        data.content = contentItem.components.content.html();
        data.score = scoreItem.$('score').value;
        data.id = state.id;
        data.type = '6';
        return data;
    },
    isValidate: function() {
        return this.items.content.validate() && this.items.score.validate();
    },
    clear: function() {
        this.renderOptions = {};
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
