var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    state: true,
    reply: true
};

exports.events = {
    'click answer-*': 'answer'
};

exports.handlers = {
    answer: function(id) {
        var el = this.$('replyandreply-answer-' + id),
            me = this,
            disply = el.style.display,
            questionReplylist = this.bindings.reply.data.questionReplylist;
        // console.log(el);
        _.forEach(questionReplylist, function(value) {
            if (value.id !== id) {
                me.$('replyandreply-answer-' + value.id).style.display = 'none';
            }
        });

        if (disply === 'inline') {
            el.style.display = 'none';
        } else if (disply === 'none') {
            el.style.display = 'inline';
        }
        this.bindings.state.data.id = id;
    }
};

exports.actions = {
    'click discuss-answer-*': 'discussanswer',
    'click reply-del-*': 'replydel',
    'click reply-answer-*': 'replyandreplyanswer'
};


exports.dataForActions = {
    discussanswer: function(payload) {
        var data = {},
            obj = this.bindings.state.data;
        _.forEach(payload, function(value, key) {
            if (key === 'id-' + obj.id) data.id = value;
            if (key === 'organizationId-' + obj.id) data.organizationId = value;
            if (key === 'toUserId-' + obj.id) data.toUserId = value;
            if (key === 'questionId-' + obj.id) data.questionId = value;
            if (key === 'content-' + obj.id) data.content = value;
        });
        return data;
    },
    replydel: function(payload) {
        return payload;
    },
    replyandreplyanswer: function(payload) {
        var data = {},
            obj = this.bindings.state.data;
        _.forEach(payload, function(value, key) {
            if (key === 'id-' + obj.id) data.id = value;
            if (key === 'organizationId-' + obj.id) data.organizationId = value;
            if (key === 'toUserId-' + obj.id) data.toUserId = value;
            if (key === 'questionId-' + obj.id) data.questionId = value;
            if (key === 'content-' + obj.id) data.content = value;
        });
        return data;
    }
};


exports.actionCallbacks = {
    discussanswer: function(payload) {
        var data = payload[0];
        this.app.message.success('回复成功！');
        this.module.dispatch('init', { id: data.discussId });
    },
    replydel: function(payload) {
        var data = payload[0];
        this.app.message.success('删除成功！');
        this.module.dispatch('init', { id: data.discussId });
    },
    replyandreplyanswer: function(payload) {
        var data = payload[0];
        this.app.message.success('回复成功！');
        this.module.dispatch('init', { id: data.discussId });
    }

};

exports.dataForTemplate = {
    reply: function(data) {
        var obj = data,
            date = new Date();
        _.map(data.reply.questionReplylist || [], function(d, i) {
            var text = '',
                date3 = date.getTime() - d.createTime,
                // 计算出相差天数
                days = Math.floor(date3 / (24 * 3600 * 1000)),
                // 计算出小时数
                leave1 = date3 % (24 * 3600 * 1000), // 计算天数后剩余的毫秒数
                hours = Math.floor(leave1 / (3600 * 1000)),
                // 计算相差分钟数
                leave2 = leave1 % (3600 * 1000), // 计算小时数后剩余的毫秒数
                minutes = Math.floor(leave2 / (60 * 1000));
            if (days > 0) text = text + days + ' 天 ';
            if (hours > 0) text = text + hours + ' 小时 ';
            if (minutes > 0) text = text + minutes + ' 分钟前 ';
            obj.reply.questionReplylist[i].time = text;
        });
        return obj.reply;
    },
    // reply: function(data) {
    //     var obj = data,
    //         // date = new Date(data.reply.createTime);
    //     // console.log(data);
    //     var url = obj.reply.member.headPortrait;
    //     // console.log(url);
    //     if (typeof url === 'undefined' || url === null || url === '') {
    //         obj.reply.member.headPortrait = 'images/default-userpic.png';
    //     } else {
    //         obj.reply.member.headPortrait = this.bindings.down.getFullUrl() + '?id=' + url;
    //     }
    // }
};
