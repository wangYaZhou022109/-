var _ = require('lodash/collection');
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        questions: { url: '../ask-bar/myquiz/question' },
        question: {
            url: '../ask-bar/myquiz/question-details',
            mixin: {
                getQuestionById: function(data) {
                    var questions = this.module.store.models.questions.data;
                    return _.find(questions, ['id', data.id]);
                }
            }
        },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function() {
            var questions = this.models.questions;
            questions.set({ id: 1 });
            return this.get(questions);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};

