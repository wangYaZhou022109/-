var helper = require('./app/util/helpers'),
    _ = require('lodash/collection'),
    $ = require('jquery'),
    nodeChanged,
    resetTree;

exports.bindings = {
    state: true,
    organizations: 'updateTree'
};

exports.events = {
    'click btn-toggle-tree': 'showTreeContent',
    'change tree': 'nodeChanged'
};

exports.handlers = {
    showTreeContent: function() {
        $(this.$('toggle-tree-content')).toggleClass('open');
    },
    nodeChanged: function(e, data) {
        nodeChanged.call(this, data);
    }
};

exports.components = [{
    id: 'tree',
    name: 'tree',
    options: {
        model: 'organizations'
    }
}];

nodeChanged = function(data) {
    return this.module.dispatch('changeOrganization', {
        id: data.id,
        name: data.text,
        organizationId: data.id
    });
};

exports.updateTree = function() {
    this.components.tree.reset(resetTree.call(this));
    nodeChanged.call(this, this.components.tree.selectRoot());
};

exports.dataForComponents = {
    tree: function() {
        return resetTree.call(this);
    }
};

resetTree = function() {
    var treeLengthThreshold = helper.setting('tree.length.threshold');
    return _.map(this.bindings.organizations.data, function(item) {
        var i = item;
        i.title = i.name;
        if (i.name.length > treeLengthThreshold) i.name = i.name.slice(0, treeLengthThreshold) + '...';
        return i;
    });
};
