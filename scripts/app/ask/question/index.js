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
            data.id = 1;
            question.set(data);
            return this.post(question);
        }
    }
};

exports.afterRender = function() {
};


exports.title = '我要提问';

exports.buttons = [{
    text: '发布'
}];
