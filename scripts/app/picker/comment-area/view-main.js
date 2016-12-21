var $ = require('jquery'),
    _ = require('lodash/collection');

exports.bindings = {
    comments: true,
    state: false
};

exports.events = {
    'click showReply-*': 'showReply'
};

exports.handlers = {
    showReply: function(id) {
        var jqReply = $(this.$('reply-content-' + id));
        jqReply.toggleClass('show');
    }
};

exports.actions = {
    'click add-comment': 'addComment',
    'click add-reply-*': 'addReply',
    'click top*': 'setTop',
    'click essence*': 'setEssence',
    'click hideComment*': 'hideComment',
    'click delComment*': 'delComment'
};
exports.dataForActions = {
    addComment: function(data) {
        return data;
    },
    addReply: function(data) {
        return data;
    },
    setTop: function(payload) {
        var data = payload;
        if (data.essenceStatus) {
            delete data.essenceStatus;
        }
        data.topStatus = data.topStatus === '1' ? 0 : 1;
        return data;
    },
    setEssence: function(payload) {
        var data = payload;
        if (data.topStatus) {
            delete data.topStatus;
        }
        data.essenceStatus = data.essenceStatus === '1' ? 0 : 1;
        return data;
    },
    hideComment: function(payload) {
        var data = payload;
        delete data.topStatus;
        delete data.essenceStatus;
        return data;
    },
    delComment: function(payload) {
        var me = this,
            data = payload;
        delete data.topStatus;
        delete data.essenceStatus;
        return this.Promise.create(function(resolve) {
            var message = '确定要删除该数据?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    }
};
exports.actionCallbacks = {
    addComment: function() {
        this.app.message.success('发表成功!');
        this.module.dispatch('init', this.module.renderOptions);
    },
    hideComment: function() {
        this.app.message.success('修改成功!');
        this.module.dispatch('init', this.module.renderOptions);
    },
    delComment: function() {
        this.app.message.success('删除成功!');
        this.module.dispatch('init', this.module.renderOptions);
    },
    setTop: function() {
        this.app.message.success('修改成功!');
        this.module.dispatch('init', this.module.renderOptions);
    },
    setEssence: function() {
        this.app.message.success('修改成功!');
        this.module.dispatch('init', this.module.renderOptions);
    }
};

exports.dataForTemplate = {
    comments: function(data) {
        var pageNum = this.bindings.comments.getPageInfo().page;
        _.map(data.comments || [], function(comment, i) {
            var r = comment;
            r.i = i + 1 + ((pageNum - 1) * 10);
            if (!r.praiseCount) {
                r.praiseCount = 0;
            }
            if (!r.commentCount) {
                r.commentCount = 0;
            }
        });
        return data.comments;
    }
};
