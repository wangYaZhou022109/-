exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        myreply: { url: '../ask-bar/my-reply' },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function() {
            var myreply = this.models.myreply;
            myreply.params = { id: 1 };
            return this.get(myreply);
        },
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};
