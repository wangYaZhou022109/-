
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        experts: { url: '../ask-bar/trends/focus-experts' }
    },
    callbacks: {
        init: function() {
            var experts = this.models.experts;
            experts.set({ id: 1222 });
            return this.get(experts);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
