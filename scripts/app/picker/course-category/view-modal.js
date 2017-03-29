exports.title = function() {
    return this.bindings.state.data.title || '选择目录';
};

exports.bindings = {
    list: true
};

exports.components = [{
    id: 'tree', name: 'tree', options: { model: 'list', openLevel: 4 }
}];

exports.buttons = [{
    text: '确定选择',
    fn: function() {
        var selected = this.components.tree.getSelectedNode();
        if (!selected.length) {
            this.app.message.error('请选择一个目录');
            return false;
        }
        this.module.dispatch('selectChanged', selected[0].data);
        return true;
    }
}];

exports.small = true;
