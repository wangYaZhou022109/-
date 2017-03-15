exports.items = {
    main: 'main',
    side: 'side',
    'ask/topicsquare/apply-topic': { isModule: true }
};

exports.store = {
    models: {
        topicname: { url: '../ask-bar/topic/topic-name' },
        state: {}
    },
    callbacks: {
        init: function() {
            var topicname = this.models.topicname;
            // topicname.params = { id: 5 };
            return this.get(topicname);
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
};
