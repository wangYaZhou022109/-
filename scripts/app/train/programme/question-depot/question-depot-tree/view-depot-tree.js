var nodeChanged,
    strings = require('./app/util/strings');

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
    'change tree': 'nodeChanged',
    'click add': 'add',
    'click remove': 'remove',
    'click edit': 'edit',
    'click import': 'importQ',
    'click export': 'exportQ'
};

exports.handlers = {
    nodeChanged: function(e, data) {
        nodeChanged.call(this, data);
    },
    add: function() {
        var mod = this.module.items['train/programme/question-depot/add-question-depot'],
            me = this;
        this.app.viewport.modal(mod, {
            organizationId: this.bindings.questionDepots.params.organizationId,
            titleType: 'add',
            callback: function() {
                return me.module.dispatch('refreshTree');
            }
        });
    },
    edit: function() {
        var mod = this.module.items['train/programme/question-depot/add-question-depot'],
            me = this;
        this.app.viewport.modal(mod, {
            titleType: 'edit',
            questionDepotId: this.components.tree.getSelected(),
            callback: function() {
                return me.module.dispatch('refreshTree');
            }
        });
    },
    remove: function() {
        var me = this;
        this.app.message.confirm(strings.getWithParams('delete-warn', '试题目录'), function() {
            return me.module.dispatch('remove', {
                id: me.components.tree.getSelected()
            });
        }, function() {
            return false;
        });
    },
    importQ: function() {
    },
    exportQ: function() {
    }
};

nodeChanged = function(data) {
    return this.module.dispatch('changeDepot', {
        id: data.id
    });
};

exports.updateDepots = function() {
    this.components.tree.reset(this.bindings.questionDepots.data);
    nodeChanged.call(this, this.components.tree.selectRoot());
};
