exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        myshares: { url: '../ask-bar/my-share' },
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

