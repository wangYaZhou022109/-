
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        reply: { url: '../ask-bar/my-manage/reply' },
        shut: { url: '../ask-bar/question/close-status' }
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
        }
    }
};

exports.afterRender = function() {
    // console.log('1111111111111');
    var data = this.renderOptions.state.data;
    console.log(data.topicid);
    if (typeof data.topicid !== 'undefined') {
        return this.dispatch('init', this.renderOptions);
    }
    return null;
};
