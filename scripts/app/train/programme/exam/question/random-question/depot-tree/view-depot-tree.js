var nodeChanged;

exports.bindings = {
    questionDepots: 'updateDepots',
};

exports.components = [function() {
    var obj = {
        id: 'tree',
        name: 'tree',
        options: {
            model: 'questionDepots',
            templates: {
                afterText: function(node, state, options) {
                    var renderOptions = options.renderOptions;
                    if (renderOptions && renderOptions.getText && typeof renderOptions.getText === 'function') {
                        return renderOptions.getText(node);
                    }
                    return '';
                }
            }
        }
    };

    if (this.module.renderOptions) {
        obj.options.renderOptions = this.module.renderOptions;
    }

    return obj;
}];

exports.events = {
    'change tree': 'nodeChanged'
};

exports.handlers = {
    nodeChanged: function(e, data) {
        nodeChanged.call(this, data);
    }
};

nodeChanged = function(data) {
    if (data) {
        return this.module.dispatch('changeDepot', {
            id: data.id,
            questionDepot: {
                id: data.id,
                name: data.text
            }
        });
    }
    return '';
};

exports.updateDepots = function() {
    this.components.tree.reset(this.bindings.questionDepots.data);
    nodeChanged.call(this, this.components.tree.selectRoot());
};

