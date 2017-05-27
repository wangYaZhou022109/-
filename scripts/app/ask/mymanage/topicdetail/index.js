exports.items = {
    topicdetail: 'topicdetail',
    menu: 'menu',
    list: 'list',
    relevantexperts: 'relevantexperts',
    relatedquestions: 'relatedquestions',
    top: 'top',
};
exports.store = {
    models: {
        followcount: { data: { menu: 'followcount' } },
        relevantexperts: { data: { menu: 'relevantexperts' } },
        relatedquestions: { data: { menu: 'relatedquestions' } },
        params: { data: { isOverdue: '1' } },
        topicdetail: { url: '../ask-bar/my-manage/topicdeal' },
        state: { data: { menu: 'news' } },
        topicname: { url: '../ask-bar/topic/topic-name' },
        down: { url: '../human/file/download' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        follow: {
            url: '../ask-bar/question-details/boutique'
        },
        expert: { url: '../ask-bar/expert/active-expert' }
    },
    callbacks: {
        init: function(paylaod) {
            var topicdetail = this.models.topicdetail;
            var topicname = this.models.topicname;
            var expert = this.models.expert;
            var state = this.models.state;
            var id = paylaod.id;
            var me = this;
            state.data = {};
            state.data.menu = 'news';
            state.data.news = true;
            state.data.topicId = paylaod.id;
            state.changed();
            topicdetail.set({ id: paylaod.id });
            this.get(topicdetail)
            .then(function() {
                topicname.params = id;
                expert.set({ id: 'undefined', size: 6 });
                // topic.params.ids = params;
                // me.get(expert);
                // me.get(question);
                me.chain([me.get(topicname), me.post(expert)]);
                // return me.get(topicname);
            });
        },
        follow: function(payload) {
            var follow = this.models.follow,
                me = this,
                topicdetail = this.models.topicdetail;
            follow.set(payload);
            topicdetail.set({ id: this.models.topicdetail.data.id, concernType: '4' });
            return this.post(follow).then(function() {
                me.app.message.success('关注成功');
                me.get(topicdetail);
            });
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow,
                me = this,
                topicdetail = this.models.topicdetail;
            topicdetail.set({ id: this.models.topicdetail.data.id, concernType: '4' });
            unfollow.set({ id: payload.id, concernType: '4' });
            return this.put(unfollow).then(function() {
                me.app.message.success('取消成功');
                me.get(topicdetail);
            });
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
    // this.dispatch('topicname');
};
