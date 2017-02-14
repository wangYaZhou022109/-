exports.bindings = {
    popupstate: true
};

exports.events = {
    'click question-*': 'popup',
    'click article-*': 'popup'
};

exports.handlers = {
    question: function(payload) {
        this.app.viewport.modal(this.module.items['ask/question'], { id: payload });
    },
    article: function(payload) {
        this.app.viewport.modal(this.module.items['ask/article'], { id: payload });
    },
    popup: function(menu) {
        var state = this.bindings.popupstate;
        state.data = {};
        state.data.menu = menu || 'question';
        state.data[menu] = true;
        state.changed();
    }
};
