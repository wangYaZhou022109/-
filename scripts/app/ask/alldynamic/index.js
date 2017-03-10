
exports.items = {
    list: 'list',
    popup: 'popup'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/all-dynamic' },
        discuss: { url: '../ask-bar/question-discuss' },
        follow: { url: '../ask-bar/question-details/boutique' },
        popupstate: { hidden: false, data: { menu: 'report' } }
    },
    callbacks: {
        init: function() {
            var trends = this.models.trends;
            trends.set({ id: 1222 });
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
    return this.dispatch('init');
};
