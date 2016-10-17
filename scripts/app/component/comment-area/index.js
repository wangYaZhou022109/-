exports.items = {
    'add-comment': 'add-comment',
    'comment-list': 'comment-list'
};

exports.store = {
    models: {
        comments: { url: '../system/comment/list/', autoLoad: 'after' },
        comment: { url: '../system/comment' },
        reply: { url: '../system/comment/reply' },
        businessModel: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var businessId = payload.businessId;

            this.models.comments.set({ id: businessId });
            this.models.businessModel.data.businessId = businessId;
        },
        addReply: function(payload) {
            var reply = this.models.reply,
                comments = this.models.comments,
                businessModel = this.models.businessModel,
                me = this;
            reply.set(payload);
            me.save(reply).then(function() {
                me.app.message.success('操作成功');
                comments.set({ id: businessModel.data.businessId });
                me.get(comments);
            });
        },
        addComment: function(payload) {
            var comment = this.models.comment,
                comments = this.models.comments,
                businessModel = this.models.businessModel,
                me = this;
            comment.set(payload);
            me.save(comment).then(function() {
                me.app.message.success('操作成功');
                comments.set({ id: businessModel.data.businessId });
                me.get(comments);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
