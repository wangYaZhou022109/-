exports.title = '选择机构部门';

exports.bindings = {
    list: true
};

exports.components = [{
    id: 'tree', name: 'tree', options: { model: 'list' }
}];

exports.buttons = [{
    text: '确定',
    fn: function() {
        var me = this,
            selected = this.components.tree.getSelectedNode();
        if (!selected.length) {
            this.app.message.error('请选择一个部门');
            return false;
        }
        return me.module.dispatch('selectTrigger', selected[0]).then(function(data) {
            return data ? me.module.dispatch('selectChanged', selected[0]) : false;
        });
    }
}];

exports.mixin = {
    rootNode: function() {
        return this.components.tree.selectRoot();
    }
};
