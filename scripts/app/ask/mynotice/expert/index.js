var _ = require('lodash/collection');
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        experts: { url: '../ask-bar/trends/focus-experts' },
        topicType: { url: '../system/topic-type' },
        down: { url: '../human/file/download' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        page: {
            data: [],
            params: { page: 1, size: 2 },
            mixin: {
                findById: function(id) {
                    var trends = this.module.store.models.page.data;
                    return _.find(trends, ['id', id]);
                }
            }
        }
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
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow,
                me = this;
            unfollow.set(payload);
            return this.put(unfollow).then(function() {
                me.app.message.success('取消成功');
                me.module.dispatch('init');
                me.module.dispatch('refresh');
            });
        }
    }
};

exports.afterRender = function() {
    this.options.store.callbacks.leftrefresh = this.renderOptions.leftrefresh;
    this.options.store.callbacks.refresh = this.renderOptions.refresh;
    this.dispatch('topicType');
    this.dispatch('init');
};
