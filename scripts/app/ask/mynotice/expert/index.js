
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        experts: { url: '../ask-bar/trends/focus-experts' },
        topicType: { url: '../system/topic-type' }
    },
    callbacks: {
        init: function() {
            var experts = this.models.experts;
            experts.set({ id: 'all' });
            return this.get(experts);
        },
        topicType: function() {
            var topicType = this.models.topicType;
            return this.get(topicType);
        },
        check: function(payload) {
            var experts = this.models.experts;
            experts.set(payload);
            return this.get(experts);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('topicType');
    this.dispatch('init');
};
