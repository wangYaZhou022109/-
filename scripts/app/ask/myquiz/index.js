exports.items = {
    list: 'list',
    top: ''
};

exports.store = {
    models: {
        question: { url: '../ask-bar/myquiz/question' },
        count: { url: '../ask-bar/myquiz/count' },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function() {
            var question = this.models.question;
            question.set({ id: 1 });
            return this.get(question);
        },
        getCount: function() {
            var count = this.models.count;
            count.set({ id: 1 });
            return this.get(count);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};

