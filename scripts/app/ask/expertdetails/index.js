
exports.items = {
    banner: 'banner',
    list: 'list'
};

exports.store = {
    models: {
        activitys: {
            url: '../exam/activity',
            type: 'pageable',
            root: 'items',
            pageSize: 6
        },
        activity: { url: '../exam/activity' },
        params: { data: { isOverdue: false } },
        down: { url: '../human/file/download' },
        expert: { url: '../ask-bar/expert' }
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
