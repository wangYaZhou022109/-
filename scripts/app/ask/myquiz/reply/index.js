
exports.items = {
    content: 'content'
};

exports.store = {
    models: {
        state: { data: {} },
        reply: { url: '../ask-bar/question-reply' }
    },
    callbacks: {
        init: function(payload) {
            var reply = this.models.reply;
            console.log(reply);
            reply.set(payload);
            this.models.state.data = payload;
            return this.get(reply);
        },
        discussanswer: function(payload) {
            var reply = this.models.reply;
            reply.set(payload);
            return this.save(reply);
        },
        replydel: function(payload) {
            var reply = this.models.reply;
            reply.set(payload);
            return this.del(reply);
        },
        replyandreplyanswer: function(payload) {
            var reply = this.models.reply;
            reply.set(payload);
            return this.save(reply);
        }
    }
};

exports.mixin = {
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
