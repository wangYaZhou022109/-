exports.bindings = {
};

exports.events = {
    'click question-*': 'question',
    'click article-*': 'article'
};

exports.handlers = {
    question: function(payload) {
        this.app.viewport.modal(this.module.items['ask/question'], { id: payload });
    },
    article: function(payload) {
        this.app.viewport.modal(this.module.items['ask/article'], { id: payload });
    }
};
