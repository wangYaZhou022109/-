exports.items = {
    details: 'details'
};

exports.store = {
    models: {
        state: {},
        trends: { url: '../ask-bar/trends' },
        question: { url: '../ask-bar/question/insert-article' }
    },
    callbacks: {
        release: function(payload) {
            var question = this.models.question,
                data = payload;
            data.id = 1;
            question.set(data);
            return this.post(question);
        }
    }
};

exports.afterRender = function() {
};
