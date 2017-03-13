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
            expert.set({ id: 'undefined', size: 6 });
            return this.post(expert);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
