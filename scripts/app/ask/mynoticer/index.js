exports.items = {
    main: 'main',
    popup: 'popup'
};

exports.store = {
    models: {
        follow: { url: '../ask-bar/trends/follow' },
        popupstate: {}
    },
    callbacks: {
        init: function() {
            var follow = this.models.follow;
            follow.set({ id: 1 });
            return this.get(follow);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
