exports.items = {
    details: 'details'
};

exports.store = {
    models: {
        state: {},
        question: { url: '../ask-bar/question/insert-question' }
    },
    callbacks: {
        release: function(payload) {
            var question = this.models.question,
                data = payload;
            data.id = -1;
            question.set(data);
            return this.save(question);
        }
    }
};

exports.afterRender = function() {
};
