exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        myreply: { url: '../ask-bar/my-reply' },
        shut: { url: '../ask-bar/question/close-status' },
        discuss: { url: '../ask-bar/question-discuss' },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function() {
            var myreply = this.models.myreply;
            myreply.params = { id: 1 };
            return this.get(myreply);
        },
        shut: function(payload) {
            this.models.shut.set(payload);
            return this.put(this.models.shut);
        },
        publish: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};
