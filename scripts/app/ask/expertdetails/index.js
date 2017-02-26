
exports.items = {
    banner: 'banner',
    list: 'list',
    relevantexperts: 'relevantexperts',
    relatedquestions: 'relatedquestions',
    top: 'top'
};

exports.store = {
    models: {
        expert: { url: '../ask-bar/expert' },
        relevantexperts: { data: { menu: 'relevantexperts' } },
        relatedquestions: { data: { menu: 'relatedquestions' } },
        state: {
            data: {
                menu: 'expertsanswer'
            }
        }
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
    this.store.models.state.data.id = this.renderOptions.id;
    this.store.models.state.changed();
    return this.dispatch('init', this.renderOptions);
};
