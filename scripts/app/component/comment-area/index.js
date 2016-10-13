exports.items = {
    'add-comment': 'add-comment',
    'comment-list': 'comment-list'
};

exports.store = {
    models: {
        comments: { url: '../system/comment/list', autoLoad: 'after' },
        comment: { url: '../system/comment' }
    },
    callbacks: {
        init: function(payload) {
            var businessId = payload.businessId;

            this.models.comments.set({ id: businessId });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
