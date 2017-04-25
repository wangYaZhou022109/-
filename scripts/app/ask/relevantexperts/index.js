exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        expert: { url: '../ask-bar/expert/relevant-experts' },
        down: { url: '../human/file/download' }
    },
    callbacks: {
        init: function(payload) {
            var expert = this.models.expert;
            expert.set({ id: payload.state.id });
            return this.get(expert);
        }
    }
};

exports.afterRender = function() {
    if (typeof this.renderOptions.state.id !== 'undefined') {
        return this.dispatch('init', this.renderOptions);
    }
    return null;
};
