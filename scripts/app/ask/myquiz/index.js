exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        question: { url: '../ask/myquiz', type: 'pageable', root: 'items', pageSize: 10 }
    },
    callbacks: {
        init: function() {
            var question = this.models.question;
            return this.get(question);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};

