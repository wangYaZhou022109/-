exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        question: { url: '../ask-bar/myquiz' },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function() {
            var question = this.models.question;
            question.set({ id: 1 });
            return this.get(question);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};

