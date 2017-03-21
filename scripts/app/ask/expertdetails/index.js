
exports.items = {
    banner: 'banner',
    list: 'list',
    relevantexperts: 'relevantexperts',
    relatedquestions: 'relatedquestions',
    top: 'top'
};

exports.store = {
    models: {
        expert: { url: '../ask-bar/expert' },
        followcount: { data: { menu: 'followcount' } },
        relevantexperts: { data: { menu: 'relevantexperts' } },
        relatedquestions: { data: { menu: 'relatedquestions' } },
        state: {
            data: {
                menu: 'expertsanswer'
            }
        },
        follow: {
            url: '../ask-bar/question-details/boutique'
        },
        unfollow: { url: '../ask-bar/concern/unfollow' }
    },
    callbacks: {
        init: function(payload) {
            var expert = this.models.expert,
                relevantexperts = this.models.relevantexperts,
                state = this.models.state,
                relatedquestions = this.models.relatedquestions,
                followcount = this.models.followcount,
                data = payload.id.split(',');
            relevantexperts.data.id = data[0];
            relevantexperts.changed();
            relatedquestions.data.id = data[0];
            relatedquestions.changed();
            state.data.id = data[0];
            state.changed();
            followcount.data.id = data[1];
            followcount.changed();
            expert.set({ id: data[0] });
            this.get(expert);
        },
        follow: function(payload) {
            var follow = this.models.follow,
                me = this,
                expert = this.models.expert;
            follow.set(payload);
            expert.set({ id: this.models.expert.data.id, concernType: '1' });
            return this.post(follow).then(function() {
                me.app.message.success('关注成功');
                me.get(expert);
            });
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow,
                me = this,
                expert = this.models.expert;
            expert.set({ id: this.models.expert.data.id, concernType: '1' });
            unfollow.set({ id: payload.id, concernType: '1' });
            return this.put(unfollow).then(function() {
                me.app.message.success('取消成功');
                me.get(expert);
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
