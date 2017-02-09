exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        question: { url: '../ask-bar/myquiz', type: 'pageable', root: 'items', pageSize: 5 }
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

