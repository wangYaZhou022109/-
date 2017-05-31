var nodeChanged,
    _ = require('lodash/collection'),
    helper = require('./app/util/helpers');

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
    nodeChanged(this, this.components.tree.selectRoot());
};

exports.handlers = {
    nodeChanged: function(e, data) {
        nodeChanged(this, data);
    }
};

nodeChanged = function(me, data) {
    var mod = me.module.module,
        callback = me.module.renderOptions.callback;
    if (mod && mod.nodeChanged && data && data.data) {
        mod.nodeChanged(data);
    } else if (callback && typeof callback === 'function') {
        callback({
            organizationId: data.id,
            organization: {
                id: data.id,
                name: data.text
            }
        });
    }
};

exports.dataForComponents = {
    tree: function() {
        var treeLengthThreshold = helper.setting('tree.length.threshold');
        return _.map(this.bindings.organizationTree.data, function(item) {
            var i = item;
            i.title = i.name;
            if (i.name.length > treeLengthThreshold) i.name = i.name.slice(0, treeLengthThreshold) + '...';
            return i;
        });
    }
};
