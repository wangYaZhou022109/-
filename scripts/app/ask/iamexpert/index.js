
exports.items = {
    banner: 'banner',
    left: 'left',
    right: 'right'
};

exports.store = {
    models: {
        expert: { url: '../ask-bar/expert' },
        leftstate: { data: { menu: 'expertsanswer' } },
        rightstate: {}
    },
    callbacks: {
        init: function(payload) {
            var expert = this.models.expert;
            expert.set(payload);
            this.get(expert);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
