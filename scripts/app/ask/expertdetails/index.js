
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
            var expert = this.models.expert,
                relevantexperts = this.models.relevantexperts,
                state = this.models.state,
                relatedquestions = this.models.relatedquestions;
            relevantexperts.data.id = payload.id;
            relevantexperts.changed();
            relatedquestions.data.id = payload.id;
            relatedquestions.changed();
            state.data.id = payload.id;
            state.changed();
            expert.set(payload);
            this.get(expert);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
