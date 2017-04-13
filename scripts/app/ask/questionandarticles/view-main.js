var $ = require('jquery');
exports.bindings = {
};

exports.events = {
    'click question-*': 'question',
    'click article-*': 'article'
};

exports.handlers = {
    question: function(payload) {
        $(window).unbind('scroll');
        this.app.viewport.modal(this.module.items['ask/question'], { id: payload });
    },
    article: function(payload) {
        $(window).unbind('scroll');
        this.app.viewport.modal(this.module.items['ask/article'], { id: payload });
    }
};
