
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
        unfollow: { url: '../ask-bar/concern/unfollow' },
    },
    callbacks: {
        init: function(payload) {
            var expert = this.models.expert,
                relevantexperts = this.models.relevantexperts,
                state = this.models.state,
                relatedquestions = this.models.relatedquestions,
                followcount = this.models.followcount;
            relevantexperts.data.id = payload.id;
            relevantexperts.changed();
            relatedquestions.data.id = payload.id;
            relatedquestions.changed();
            state.data.id = payload.id;
            state.changed();
            followcount.data.id = payload.id;
            followcount.changed();
            expert.set(payload);
            this.get(expert);
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow,
                me = this,
                followcount = this.models.followcount;
            followcount.data.id = payload.id;
            unfollow.set(payload);
            console.log(unfollow);
            return this.put(unfollow).then(function() {
                me.app.message.success('取消成功');
                followcount.changed();
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
