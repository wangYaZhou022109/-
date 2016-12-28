var D = require('drizzlejs');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        comments: { url: '../system/comment', root: 'items', type: 'pageable' },
        comment: { url: '' },
        reply: { url: '../system/comment/reply' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var businessId = payload.businessId,
                businessType = payload.businessType,
                comments = this.models.comments,
                state = this.models.state;
            state.data.businessId = businessId;
            state.data.businessType = businessType;
            state.data.available = payload.available;
            if (typeof payload.available !== 'boolean') {
                state.data.available = true;
            }
            comments.params = { businessId: businessId };
            this.get(comments);
        },
        setTop: function(payload) {
            var comment = this.models.comment;
            comment.options.url = '../system/comment/top';
            comment.set(payload);
            return this.save(comment);
        },
        setEssence: function(payload) {
            var comment = this.models.comment;
            comment.options.url = '../system/comment/essence';
            comment.set(payload);
            return this.save(comment);
        },
        hideComment: function(payload) {
            var comment = this.models.comment;
            comment.options.url = '../system/comment/hide';
            comment.set(payload);
            return this.save(comment);
        },
        delComment: function(payload) {
            var comment = this.models.comment;
            comment.options.url = '../system/comment';
            comment.set(payload);
            return this.del(comment);
        },
        addComment: function(payload) {
            var comment = this.models.comment,
                state = this.models.state;
            comment.options.url = '../system/comment';
            comment.set(payload);
            D.assign(comment.data, state.data);
            return this.save(comment);
        },
        addReply: function(payload) {
            var reply = this.models.reply,
                comments = this.models.comments,
                state = this.models.state,
                me = this;
            reply.set(payload);
            me.save(reply).then(function() {
                me.app.message.success('操作成功');
                comments.set({ id: state.data.businessId });
                me.get(comments);
            });
        },
        praise: function(payload) {
            var comment = this.models.comment;
            comment.options.url = '../system/comment/praise';
            comment.set(payload);
            return this.save(comment);
        },
        cancelPraise: function(payload) {
            var comment = this.models.comment;
            comment.options.url = '../system/comment/cancel-praise';
            comment.set(payload);
            return this.del(comment);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
