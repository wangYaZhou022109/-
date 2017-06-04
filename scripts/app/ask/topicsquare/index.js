exports.items = {
    main: 'main',
    // side: 'side',
    'ask/topicsquare/apply-topic': { isModule: true }
};

exports.store = {
    models: {
        topicType: { url: '../system/topic-type' },
        topicname: { url: '../ask-bar/topic/topic-name' },
        checkOne: { url: '../ask-bar/topic/topic-name' },
        // follow: { url: '../ask-bar/question-details/boutique' },
        // unfollow: { url: '../ask-bar/concern/unfollow' },
        follow: {
            url: '../ask-bar/question-details/boutique'
        },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        down: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        refresh: function() {
            this.models.refresh();
        },
        set: function(payload) {
            this.models.refresh = payload;
        },
        init: function() {
            var topicname = this.models.topicname;
            // topicname.params = { id: 5 };
            return this.get(topicname);
        },
        topicType: function() {
            var topicType = this.models.topicType;
            return this.get(topicType);
        },
        checkOne: function(payload) {
            var topicname = this.models.topicname;
            var checkOne = this.models.checkOne;
            checkOne.params = payload;
            return this.get(checkOne).then(function() {
                topicname.clear();
                topicname.data = checkOne.data;
                topicname.changed();
            });
        },
        checkAll: function() {
            var topicname = this.models.topicname;
            return this.get(topicname);
        },
        // follow: function(payload) {
        //     var follow = this.models.follow,
        //         me = this,
        //         init = this.models.init;
        //     follow.set(payload);
        //     init.set({ id: this.models.init.data.id, concernType: '4' });
        //     return this.post(follow).then(function() {
        //         me.app.message.success('关注成功');
        //         me.get(init);
        //     });
        // },
        // unfollow: function(payload) {
        //     var unfollow = this.models.unfollow,
        //         me = this,
        //         init = this.models.init;
        //     init.set({ id: this.models.init.data.id, concernType: '4' });
        //     unfollow.set({ id: payload.id, concernType: '4' });
        //     return this.put(unfollow).then(function() {
        //         me.app.message.success('取消成功');
        //         me.get(init);
        //     });
        // },
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
    }
};
exports.beforeRender = function() {
    this.dispatch('set', this.renderOptions.refresh);
    // console.log(this.renderOptions);
    this.dispatch('init');
    this.dispatch('topicType', this.renderOptions);
};
