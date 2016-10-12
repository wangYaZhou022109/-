exports.title = '选择题库';

exports.bindings = {
    list: true
};

exports.components = [{
    id: 'tree', name: 'tree', options: { model: 'list' }
}];

exports.buttons = [{
    text: '确定选择',
    fn: function() {
        var selected = this.components.tree.getSelectedNode();
        if (!selected.length) {
            this.app.message.error('请选择一个题库');
            return false;
        }
        this.module.dispatch('selectChanged', selected[0]);
        return true;
    }
}];
