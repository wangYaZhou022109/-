exports.bindings = {
};

exports.events = {
    'click article-*': 'article'
};

exports.handlers = {
    article: function(payload) {
        this.app.viewport.modal(this.module.items['ask/article'], { id: payload });
    }
};
