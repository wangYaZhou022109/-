
exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        reply: { url: '../ask-bar/my-manage/reply' },
        shut: { url: '../ask-bar/question/close-status' },
        discuss: { url: '../ask-bar/question-discuss' }
    },
    callbacks: {
        init: function(payload) {
            var reply = this.models.reply;
            reply.set({ id: payload.state.data.topicid });
            return this.get(reply);
        },
        shut: function(payload) {
            this.models.shut.set(payload);
            return this.put(this.models.shut);
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        unfollow: function(payload) {
            var follow = this.models.unfollow;
            // console.log(payload);
            follow.set(payload);
            return this.put(follow);
        },
        publish: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        }
    }
};

exports.afterRender = function() {
    var data = this.renderOptions.state.data;
    if (typeof data.topicid !== 'undefined') {
        return this.dispatch('init', this.renderOptions);
    }
    return null;
};
