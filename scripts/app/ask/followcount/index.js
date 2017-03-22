exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        follow: { url: '../ask-bar/concern/follow' }
    },
    callbacks: {
        init: function(payload) {
            var follow = this.models.follow;
            follow.set({ id: payload.state.id });
            return this.get(follow);
        }
    }
};

exports.afterRender = function() {
    if (typeof this.renderOptions.state.id !== 'undefined' && this.renderOptions.state.id !== '') {
        return this.dispatch('init', this.renderOptions);
    }
    return null;
};
