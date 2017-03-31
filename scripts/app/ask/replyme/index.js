exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        replyme: { url: '../ask-bar/reply-me' },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function() {
            var replyme = this.models.replyme;
            replyme.params = { id: 1 };
            return this.get(replyme);
        },
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};
