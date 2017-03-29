exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        myreply: { url: '../ask-bar/question-discuss/answer' },
        del: { url: '../ask-bar/trends/del' }
    },
    callbacks: {
        init: function() {
            var myreply = this.models.myreply;
            myreply.set({ id: 'me' });
            return this.post(myreply);
        },
        remove: function(payload) {
            var del = this.models.del;
            del.set(payload);
            return this.put(del);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};
