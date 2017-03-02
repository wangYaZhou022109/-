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
        state.data.title = '';
        if (menu === 'question') {
            state.data.title = '我要提问';
        } else if (menu === 'article') {
            state.data.title = '我要分享';
        }
        state.data.menu = menu || 'question';
        state.data[menu] = true;
        state.changed();
    }
};
