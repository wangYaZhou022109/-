exports.items = {
    main: 'main',
    'ask/followme': { isModule: true }
};

exports.store = {
    models: {
        follow: { url: '../ask-bar/concern/followMeCount' }
    },
    callbacks: {
        init: function() {
            var follow = this.models.follow;
            follow.set({ id: 'me' });
            return this.get(follow);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
