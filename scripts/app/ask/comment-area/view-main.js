var $ = require('jquery'),
    sensitive = require('./app/util/sensitive'),
    _ = require('lodash/collection');

exports.bindings = {
    comments: true,
    state: false
};

exports.events = {
    'click showReply-*': 'showReply',
    'click accuse-*': 'accuse',
};

exports.handlers = {
    showReply: function(id) {
        var jqReply = $(this.$('reply-content-' + id));
        jqReply.toggleClass('show');
    },
    accuse: function(payload) {
        var data = payload.split('_');
        var title = this.bindings.state.data.title;
        var businessId = this.bindings.state.data.businessId;
        var sourceType = 0;
         //  评论业务类型：1:课程,2:专题,3:知识,4:班级
        var businessType = this.bindings.state.data.businessType;
        // 举报业务类型 ：1问吧 2知识 3课程 4专题 5班级 6幕课
        if (businessType === 1) {
            sourceType = 3;
        } else if (businessType === 2) {
            sourceType = 4;
        } else if (businessType === 3) {
            sourceType = 2;
        } else if (businessType === 4) {
            sourceType = 5;
        }
        this.app.viewport.modal(this.module.items['picker/comment-area/accuse'], {
            id: data[1],
            objectType: data[0],
            beUserId: data[2],
            sourceTitle: title,
            sourceType: sourceType,
            content: data[3],
            sourceId: businessId
        });
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
            this.app.message.error('讨论内容不能为空');
            return false;
        }
        if ($.trim(data.content).length > 3000) {
            this.app.message.error('讨论内容须在3000字符以内');
            return false;
        }
        if (sensitive.judge(data.content) > 0) {
            this.app.message.error('您好，您发表的内容被系统检测到包含敏感词，请重新编辑，谢谢合作');
            return false;
        }
        return data;
    },
    addReply: function(payload) {
        var data = payload;
        data.content = $.trim(data.content);
        if (!$.trim(data.content).length) {
            this.app.message.error('回复内容不能为空');
            return false;
        }
        if ($.trim(data.content).length > 300) {
            this.app.message.error('您回复内容超过300字符！');
            return false;
        }
        if (sensitive.judge(data.content) > 0) {
            this.app.message.error('您好，您发表的内容被系统检测到包含敏感词，请重新编辑，谢谢合作');
            return false;
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
    addComment: function(data) {
        if (data[0].auditStatus === 0) {
            this.app.message.success('发表成功，等待管理员审核!');
        } else {
            this.app.message.success('发表成功!');
        }
        this.module.dispatch('init', this.module.renderOptions);
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
    // comments: function(data) {
    //     var pageNum = this.bindings.comments.getPageInfo().page;
    //     _.forEach(data.comments || [], function(comment, i) {
    //         var r = comment;
    //         r.i = i + 1 + ((pageNum - 1) * 10);

    //         if (!r.avatarId) {
    //             r.avatarId = 'images/default-userpic.png';
    //         } else {
    //             r.avatarId = '/api/v1/human/file/download?id=' + r.avatarId;
    //         }
    //         _.forEach(r.replies || [], function(reply) {
    //             var rr = reply;
    //             if (!rr.avatarId) {
    //                 rr.avatarId = 'images/default-userpic.png';
    //             } else {
    //                 rr.avatarId = '/api/v1/human/file/download?id=' + rr.avatarId;
    //             }
    //         });
    //     });
    //     return data.comments;
    // }
};
