// var $ = require('jquery');
exports.bindings = {
};

exports.events = {
    'click question-*': 'question',
    'click article-*': 'article'
};

exports.handlers = {
    question: function(payload) {
        var me = this;
        // $(window).unbind('scroll');
        this.app.viewport.modal(
            this.module.items['ask/question'],
            {
                leftrefresh: function() {
                    me.module.renderOptions.leftrefresh();
                },
                id: payload
            }
        );
    },
    article: function(payload) {
        var me = this;
        // $(window).unbind('scroll');
        // this.app.viewport.modal(this.module.items['ask/article'], { id: payload });
        this.app.viewport.modal(
            this.module.items['ask/article'],
            {
                leftrefresh: function() {
                    me.module.renderOptions.leftrefresh();
                },
                id: payload
            }
        );
    }
};
