exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        questions: { url: '../ask-bar/myquiz/question' },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function() {
            var questions = this.models.questions;
            questions.set({ id: 1 });
            return this.get(questions);
        },
        remove: function(payload) {
            var questions = this.models.questions;
            questions.set(payload);
            return this.get(questions);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};

