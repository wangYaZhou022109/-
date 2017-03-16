exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        myreply: { url: '../ask-bar/question-discuss/answer' }
    },
    callbacks: {
        init: function() {
            var myreply = this.models.myreply;
            myreply.set({ id: 'me' });
            return this.post(myreply);
        },
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};
