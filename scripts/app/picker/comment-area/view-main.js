var $ = require('jquery'),
    sensitive = require('./app/util/sensitive'),
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
    'click delComment*': 'delComment',
    'click praise*': 'praise',
    'click cancel-praise*': 'cancelPraise'
};
exports.dataForActions = {
    addComment: function(payload) {
        var data = payload;
        data.content = $.trim(data.content);
        if (!$.trim(data.content).length) {
            return this.app.message.error('评论内容不能为空');
        }
        if ($.trim(data.content).length > 3000) {
            return this.app.message.error('评论内容过长');
        }
        if (sensitive.judge(data.content) > 0) {
            return this.app.message.error('您好，您发表的内容被系统检测到包含敏感词，请重新编辑，谢谢合作');
        }
        return data;
    },
    addReply: function(payload) {
        var data = payload;
        data.content = $.trim(data.content);
        if (!$.trim(data.content).length) {
            return this.app.message.error('回复内容不能为空');
        }
        if ($.trim(data.content).length > 300) {
            return this.app.message.error('回复内容过长');
        }
        if (sensitive.judge(data.content) > 0) {
            return this.app.message.error('您好，您发表的内容被系统检测到包含敏感词，请重新编辑，谢谢合作');
        }
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
    },
    praise: function(payload) {
        return payload;
    },
    cancelPraise: function(payload) {
        var data = {};
        data.id = payload.praiseId;
        return data;
    }
};
exports.actionCallbacks = {
    addComment: function() {
        this.module.dispatch('init', this.module.renderOptions).then(function() {
            this.app.message.success('发表成功!');
        });
    },
    hideComment: function() {
        this.module.dispatch('init', this.module.renderOptions).then(function() {
            this.app.message.success('修改成功!');
        });
    },
    delComment: function() {
        this.module.dispatch('init', this.module.renderOptions).then(function() {
            this.app.message.success('删除成功!');
        });
    },
    setTop: function() {
        this.module.dispatch('init', this.module.renderOptions).then(function() {
            this.app.message.success('修改成功!');
        });
    },
    setEssence: function() {
        this.module.dispatch('init', this.module.renderOptions).then(function() {
            this.app.message.success('修改成功!');
        });
    },
    praise: function() {
        this.module.dispatch('init', this.module.renderOptions).then(function() {
            this.app.message.success('点赞成功!');
        });
    },
    cancelPraise: function() {
        this.module.dispatch('init', this.module.renderOptions).then(function() {
            this.app.message.success('取消成功!');
        });
    }
};

exports.dataForTemplate = {
    comments: function(data) {
        var pageNum = this.bindings.comments.getPageInfo().page;
        _.forEach(data.comments || [], function(comment, i) {
            var r = comment;
            r.i = i + 1 + ((pageNum - 1) * 10);

            if (!r.avatarId) {
                r.avatarId = 'images/default-userpic.png';
            } else {
                r.avatarId = '/api/v1/human/file/download?id=' + r.avatarId;
            }
            _.forEach(r.replies || [], function(reply) {
                var rr = reply;
                if (!rr.avatarId) {
                    rr.avatarId = 'images/default-userpic.png';
                } else {
                    rr.avatarId = '/api/v1/human/file/download?id=' + rr.avatarId;
                }
            });
        });
        return data.comments;
    }
};
