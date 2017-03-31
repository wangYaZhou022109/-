exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        myshares: { url: '../ask-bar/my-share' },
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function() {
            var myshares = this.models.myshares;
            myshares.params = { id: 1 };
            return this.get(myshares);
        },
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};

