
exports.items = {
    list: 'list',
    'ask/expertactivation': { isModule: true },
    'ask/expertapply': { isModule: true },
    'ask/applyexpertaptitude': { isModule: true }
};

exports.store = {
    models: {
        expertlist: { url: '../ask-bar/expert/active-expert' },
    },
    callbacks: {
        init: function() {
            var expert = this.models.expertlist;
            expert.set({ id: 'undefined' });
            return this.post(expert);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
