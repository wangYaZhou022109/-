var D = require('drizzlejs');
exports.type = 'dynamic';

exports.bindings = {
    state: false,
    details: true
};
exports.events = {
    'click discuss-answer-*': 'discussanswer'
};

exports.handlers = {
    discussanswer: function(id) {
        var region;
        var el = this.$('reply-' + id);
        if (el.style.display === 'none') {
            el.style.display = 'inline';
            region = new D.Region(this.app, this.module, el, id);
            region.show('ask/question/reply', { id: id });
        } else {
            el.style.display = 'none';
        }
    }
};
exports.actions = {
    'click close': 'close',
    'click boutique': 'boutique',
    'click discuss': 'discuss',
    'click discuss-top-*': 'discusstop',
    'click discuss-boutique-*': 'discussboutique',
    'click discuss-del-*': 'discussdel'
};

// actions绑定的方法调用前要干的事情
exports.dataForActions = {
    close: function(payload) {
        return payload;
    },
    boutique: function(payload) {
        return payload;
    },
    discuss: function(payload) {
        var data = payload;
        return data;
    },
    discussdel: function(payload) {
        return payload;
    },
    discusstop: function(payload) {
        return payload;
    },
    discussboutique: function(payload) {
        return payload;
    },
    replyanswer: function(payload) {
        return payload;
    },
    replydel: function(payload) {
        return payload;
    }
};

// actions绑定的方法调用后要干的事情
exports.actionCallbacks = {
    close: function() {
        this.app.message.success('问题关闭成功！');
        this.app.viewport.closeModal();
        this.module.dispatch('refreshquestions');
    },
    boutique: function(payload) {
        this.app.message.success('精品设置成功！');
        this.module.dispatch('refresh', payload);
    },
    discuss: function(payload) {
        this.app.message.success('讨论发表成功！');
        this.module.dispatch('refresh', payload);
    },
    discussdel: function(payload) {
        this.app.message.success('讨论删除成功！');
        this.module.dispatch('refresh', payload);
    },
    discusstop: function(payload) {
        this.app.message.success('置顶成功！');
        this.module.dispatch('refresh', payload);
    },
    discussboutique: function(payload) {
        this.app.message.success('加精成功！');
        this.module.dispatch('refresh', payload);
    }
};


exports.dataForTemplate = {
    details: function(data) {
        var obj = data,
            date = new Date(data.details.createTime);
        obj.details.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        + '   ' + date.getHours() + ':' + date.getMinutes();
        return obj.details;
    }
};
