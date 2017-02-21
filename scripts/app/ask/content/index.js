exports.items = {
    'ask/question': { isModule: true },
    middle: 'middle',
    top: 'top',
    bottom: 'bottom',
    left: 'left',
    popup: 'popup',
    'ask/article': { isModule: true }

};
exports.store = {
    models: {
        state: { data: { menu: 'contentleft' } },
        popupstate: { data: { menu: 'alldynamic' } },
        follow: { url: '../ask-bar/trends/follow' }
    },
    callbacks: {
        init: function() {
            var follow = this.models.follow;
            follow.set({ id: 1 });
            return this.get(follow);
        },
        search: function() {
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
