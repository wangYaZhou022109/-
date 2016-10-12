exports.bindings = {
    state: false
};

exports.events = {
    'click selectMember': 'showMember',
    'click clearMembers': 'clearMembers'
};

exports.handlers = {
    showMember: function() {
        var me = this,
            model = me.module.items['picker/members/select-member'];

        me.app.viewport.modal(model, {
            ids: me.components.tags.getValue(),
            callback: function(payload, flag) {     // 选中添加，非选中取消添加。
                flag ? me.components.tags.addItem({ value: payload.id, text: payload.name }) :
                    me.components.tags.removeItem(payload.id);
            }
        });
    },
    clearMembers: function() {
        this.components.tags.clear();
    }
};

exports.components = [function() {
    var data = this.bindings.state.data;
    var inputName = data.inputName || 'memberIds',
        tags = data.tags || [];
    return {
        id: 'tags',
        name: 'tag-view',
        options: {
            name: inputName,
            emptyText: '请选择人员',
            tags: tags
        }
    };
}];
