exports.bindings = {
    state: true
};

// exports.type = 'form';

exports.dataForTemplate = {
    name: function() {
        return this.module.renderOptions.name;
    },

    emptyText: function() {
        return this.module.renderOptions.emptyText;
    },
    placeholder: function(data) {
        if (data.state.list.length > 0) return '';
        return this.module.renderOptions.placeholder || '';
    },
    values: function() {
        return this.module.getValue();
    },

    tags: function(data) {
        return data.state.list;
    }
};

exports.actions = {
    'click remove-*': 'remove'
};

exports.dataForActions = {
    remove: function(data) {
        return { values: [data['tag-view-remove']] };
    }
};

exports.events = {
    'keyup addTopic': 'addTopic'
};

exports.handlers = {
    addTopic: function(e, elem) {
        var element = elem || {};
        var opt = this.module.renderOptions,
            state = this.bindings.state.data;
        var pro = opt.entryCallback,
            limit = opt.limit,
            size = state.list.length;

        if (!pro || e.keyCode !== 13) return false;
        if (size >= limit) {
            element.value = '';
            this.app.message.error('只能添加' + limit + '项');
            return false;
        }
        if (element.value.length > 10) {
            this.app.message.error('标签长度不能超过10个字符');
            return false;
        }
        if (element.value.trim() === '') { // 输入空格，不允许添加标签
            element.value = '';
            return false;
        }
        element.focus();
        return pro(element.value);
    }
};
exports.afterRender = function() {
    var pro = this.module.renderOptions.changeCallback;
    var ids = this.module.getValue();
    if (pro) return pro(ids);
    return false;
};

