var $ = require('jquery');
exports.bindings = {
    question: true,
    follow: true,
    unfollow: true
};

exports.dataForTemplate = {
    question: function(data) {
        var question = data.question,
            canDelete = { 0: 'color-ing', 2: 'color-error' };
        question.discussTxt = '评论(' + question.discussNum + ')';
        question.canDelete = canDelete[question.auditStatus];
        return question;
    }
};

exports.components = [function() { // 分享组件
    var data = {},
        question = this.bindings.question.data;
    if (question) {
        data.id = question.id;
        data.type = '10';
        data.title = question.title;
    }
    return {
        id: 'share',
        name: 'picker',
        options: {
            picker: 'share',
            data: data
        }
    };
}];

exports.events = {
    'click follow': 'follow',
    'click discuss': 'discuss',
    'click remove': 'remove'
};
exports.actions = {
    'click publish': 'publish'
};

exports.handlers = {
    follow: function() {
        this.module.dispatch('changeFollow');
    },
    discuss: function() {
        $(this.$('comment-reply')).toggleClass('show');
    },
    remove: function() {
        var me = this,
            question = me.bindings.question.data;
        return this.Promise.create(function(resolve) {
            var message = '是否确定删除该问题?';
            me.app.message.confirm(message, function() {
                me.module.renderOptions.callback(me, question.id);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    publish: function() {
        this.app.message.success('操作成功！');
    }
};
