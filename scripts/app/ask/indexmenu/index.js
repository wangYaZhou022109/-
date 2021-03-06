exports.items = {
    main: 'main',
    'ask/mynotice': { isModule: true }
};

exports.store = {
    models: {
        follow: { url: '../ask-bar/concern/follow' },
        topicmanage: { url: '../system/topic/find-by-manager' }
    },
    callbacks: {
        init: function() {
            var follow = this.models.follow;
            follow.set({ id: 'me' });
            return this.get(follow);
        },
        topicmanage: function() {
            var topicmanage = this.models.topicmanage;
            return this.get(topicmanage);
        },
    }
};

exports.afterRender = function() {
    this.options.store.callbacks.leftrefresh = this.renderOptions.leftrefresh;
    this.options.store.callbacks.bottomsrefresh = this.renderOptions.bottomsrefresh;
    this.options.store.callbacks.refresh = this.renderOptions.refresh;
    this.dispatch('topicmanage');
    this.dispatch('init', this.renderOptions);
};
