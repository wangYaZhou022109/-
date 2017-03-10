

exports.items = {
    list: 'list',
    popup: 'popup'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/experts-sharing' },
        discuss: { url: '../ask-bar/question-discuss' },
        follow: { url: '../ask-bar/question-details/boutique' },
        popupstate: { hidden: false, data: { menu: 'report' } }
    },
    callbacks: {
        init: function(payload) {
            var trends = this.models.trends,
                id = 'all';
            if (typeof payload.state.id !== 'undefined') {
                id = payload.state.id;
            }
            trends.set({ id: id });
            return this.get(trends);
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        publish: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
