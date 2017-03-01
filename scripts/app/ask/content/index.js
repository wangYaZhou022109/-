
exports.items = {
    'ask/question': { isModule: true },
    middle: 'middle',
    top: 'top',
    bottom: 'bottom',
    hottopic: 'hottopic',
    left: 'left',
    popup: 'popup',
    'ask/article': { isModule: true }

};
exports.store = {
    models: {
        state: { data: { menu: 'contentleft' } },
        popupstate: { data: { menu: 'alldynamic' } },
        hottopicstate: { data: { menu: 'hottopic' } },
        activeexpertstate: { data: { menu: 'activeexpert' } },
        follow: { url: '../ask-bar/trends/follow' }
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
