var $ = require('jquery');
exports.bindings = {
    answer: true
};

exports.dataForTemplate = {
    answer: function(data) {
        var answer = data.answer,
            praiseNum = answer.praiseNum || 0,
            textFont = { 0: 'color-ing', 2: 'color-error' };
        answer.answerTxt = (answer.answerNum || 0) + '条回复';
        answer.praiseTxt = answer.praise ? '已赞(' + praiseNum + ')' : '赞(' + praiseNum + ')';
        answer.textFont = textFont[answer.auditStatus];
        return answer;
    }
};

exports.components = [function() { // 分享组件
    var data = {},
        answer = this.bindings.answer.data;
    if (answer) {
        data.id = answer.id;
        data.type = '10';
        data.title = answer.title;
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
    'click answer': 'answer',
    'click remove': 'remove',
    'click praise': 'praise'
};
exports.actions = {
    'click publish': 'publish'
};

exports.handlers = {
    answer: function() {
        $(this.$('comment-reply')).toggleClass('show');
    },
    remove: function() {
        var me = this,
            answer = me.bindings.answer.data;
        return this.Promise.create(function(resolve) {
            var message = '是否确定删除该问题?';
            me.app.message.confirm(message, function() {
                me.module.renderOptions.callback(answer);
            }, function() {
                resolve(false);
            });
        });
    },
    praise: function() {
        var answer = this.bindings.answer.data,
            funName = answer.praise ? 'unpraise' : 'praise';
        this.module.dispatch(funName).then(function() {
            this.app.message.success('操作成功！');
        });
    }
};

exports.actionCallbacks = {
    publish: function() {
        this.app.message.success('操作成功！');
    }
};
