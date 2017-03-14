
exports.items = {
    banner: 'banner',
    left: 'left',
    right: 'right',
    'ask/changetopic': { isModule: true }
};

exports.store = {
    models: {
        expert: { url: '../ask-bar/expert' },
        leftstate: { data: { menu: 'expertsanswer' } },
        rightstate: {}
    },
    callbacks: {
        init: function() {
            var expert = this.models.expert;
            expert.set({ id: 'me' });
            this.get(expert);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
