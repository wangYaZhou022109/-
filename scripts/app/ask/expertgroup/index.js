
exports.items = {
    list: 'list',
    'ask/expertactivation': { isModule: true },
    'ask/expertapply': { isModule: true },
    'ask/applyexpertaptitude': { isModule: true }
};

exports.store = {
    models: {
        expertlist: { url: '../ask-bar/expert/expert-group' },
        topicType: { url: '../system/topic-type' }
    },
    callbacks: {
        init: function() {
            var expert = this.models.expertlist;
            expert.set({ id: 'undefined' });
            return this.post(expert);
        },
        topicType: function() {
            var topicType = this.models.topicType;
            return this.get(topicType);
        },
        check: function(payload) {
            var expert = this.models.expertlist;
            // var topicType = this.models.topicType;
            expert.set(payload);
            // console.log(topicType);
            return this.post(expert).then(function() {
                // topicType.clear();
                // topicType.data = topicType.data;
               //  topicType.changed();
            });
        }
    }
};

exports.afterRender = function() {
    this.dispatch('topicType', this.renderOptions);
    this.dispatch('init', this.renderOptions);
};
