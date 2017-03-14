exports.bindings = {
    popupstate: true
};

exports.events = {
    'click article-*': 'article'
};

exports.handlers = {
    article: function(payload) {
        this.app.viewport.modal(this.module.items['ask/article'], { id: payload });
    },
    popup: function(menu) {
        var state = this.bindings.popupstate;
        state.data = {};
        state.hidden = true;
        state.data.title = '';
        state.data.title = '我要分享';
        state.data.menu = menu || 'article';
        state.data[menu] = true;
        state.changed();
    }
};
