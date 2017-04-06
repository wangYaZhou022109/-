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
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        state: {}
    },
    callbacks: {
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
    this.dispatch('init');
    this.dispatch('topicType', this.renderOptions);
};
