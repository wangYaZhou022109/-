
exports.type = 'form';

exports.bindings = {
    state: false
};

exports.events = {
    'click selectTopic': 'showTopic',
    'click clearTopic': 'clearTopic'
};

exports.handlers = {
    showTopic: function() {
        var me = this,
            model = me.module.items['picker/topics/select-topic'],
            data = this.bindings.state.data;

        me.app.viewport.modal(model, {
            ids: me.components.tags.getValue(),
            callback: function(payload, flag) {     // 选中添加，非选中取消添加。
                if (flag) {
                    if (data.limit && me.components.tags.getData().length >= data.limit) {
                        me.app.message.error('只能添加' + data.limit + '个');
                    } else {
                        me.components.tags.addItem({ value: payload.id, text: payload.name });
                    }
                } else {
                    me.components.tags.removeItem(payload.id);
                }
            }
        });
    },
    clearTopic: function() {
        this.components.tags.clear();
    }
};

exports.components = [function() {
    var data = this.bindings.state.data;
    var inputName = data.inputName || 'topicIds',
        tags = data.tags || [];
    return {
        id: 'tags',
        name: 'tag-view',
        options: {
            name: inputName,
            emptyText: '请选择话题',
            tags: tags
        }
    };
}];
