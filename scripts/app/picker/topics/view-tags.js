exports.bindings = {
    state: false
};

exports.components = [function() {
    var me = this,
        data = this.bindings.state.data;
    var inputName = data.inputName || 'topicIds';
    var result = {
        id: 'tags',
        name: 'tag-view',
        options: {
            name: inputName,
            emptyText: '请选择话题',
            placeholder: data.placeholder,
            entryCallback: function(d) {
                return me.module.dispatch('quick-add', { name: d, typeName: data.insertTypeName }).then(function(t) {
                    var topic = t[0];
                    me.components.tags.addItem({ value: topic.id, text: topic.name });
                });
            },
            changeCallback: function(ids) {
                return me.module.dispatch('change-hot', ids);
            }
        }
    };
    if (data.tags) result.tags = data.tags;
    return result;
}];
