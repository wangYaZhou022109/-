var nodeChanged;
exports.components = [{
    id: 'tree',
    name: 'tree',
    options: {
        model: 'organizationTree'
    }
}];

exports.events = {
    'change tree': 'nodeChanged'
};

exports.bindings = {
    organizationTree: 'updateTree'  // 修改成函数触发，原来true会加载2次树，第一次是空。
};

exports.updateTree = function() {
    this.components.tree.reset(this.bindings.organizationTree.data);
    // 选中第一个节点，并手动调用上层module的nodeChange方法
    nodeChanged(this, this.components.tree.selectRoot());
};

exports.handlers = {
    nodeChanged: function(e, data) {
        nodeChanged(this, data);
    }
};

nodeChanged = function(me, data) {
    var mod = me.module.module,
        callback = me.module.renderOptions.nodeChanged;
    if (mod && mod.nodeChanged && data && data.data) {
        mod.nodeChanged(data);
    } else if (callback && typeof callback === 'function') {
        callback(data);
    }
};
