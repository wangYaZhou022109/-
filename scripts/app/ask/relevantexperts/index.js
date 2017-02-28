exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        expert: { url: '../ask-bar/expert/active-expert' }
    },
    callbacks: {
        init: function() {
            var expert = this.models.expert;
            expert.set({ id: 1222 });
            return this.get(expert);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
