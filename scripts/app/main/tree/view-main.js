var D = require('drizzlejs'),
    $ = require('jquery'),
    Engine = require('../../ext/modules/callback-template-engine');

exports.templateEngine = new Engine({ callback: function(data) {
    var emptyStr = data.options.emptyStr || '';
    if (!data.tree.list || !data.tree.list.length) return emptyStr;
    return data.options.templates.tree(data.tree.list, data.state, data.options, data);
} });

exports.bindings = {
    tree: true,
    state: true
};

exports.dataForTemplate = {
    options: function() {
        return D.assign({}, this.module.treeOptions, {
            templates: D.assign({}, this.templates, this.module.treeOptions.templates),
            className: D.assign({}, this.className, this.module.treeOptions.className)
        });
    }
};

exports.mixin = {
    templates: {
        tree: function(tree, states, options, data) {
            var html = '<ul>',
                i;
            for (i = 0; i < tree.length; i++) {
                html += options.templates.node(tree[i], states[tree[i].id] || {}, options, data);
            }

            html += '</ul>';
            return html;
        },
        node: function(node, state, options, data) {
            var html;
            if (state.unmatched) return '';
            html = '<li id="node-' + node.id + '"';
            html += ' class="' + (options.templates.state(node, state, options, data) || '') + '"';
            html += '>';
            html += options.templates.handler(node, state, options, data) || '';
            html += '<div class="dtree-node-content">';
            html += options.templates.icon(node, state, options, data) || '';
            html += options.templates.checkbox(node, state, options, data) || '';
            html += options.templates.text(node, state, options, data) || '';
            html += options.templates.afterText(node, state, options, data) || '';
            html += options.templates.buttons(node, state, options, data) || '';
            html += '</div>';

            if (node.children.length && !state.hideChildren) {
                html += options.templates.tree(node.children, data.state, options, data);
            }

            html += '</li>';
            return html;
        },
        state: function(node, state, options) {
            var names = [];
            if (state.opened) names.push(options.className.opened);
            if (state.selected === 2) names.push(options.className.indeterminate);
            else if (state.selected) names.push(options.className.selected);
            if (node.children.length && !state.hideChildren) names.push(options.className.hasChild);
            return names.join(' ');
        },
        handler: function(node, state, options) {
            return '<i class="' + options.className.handler + '" id="h-' + node.id + '"></i>';
        },
        icon: function() {
        },
        checkbox: function(node, state, options) {
            if (!options.checkbox) return '';
            return '<i class="dtree-checkbox" id="chk-' + node.id + '"></i>';
        },
        text: function(node) {
            return '<span id="text-' + node.id + '">' + node.text + '</span>';
        },
        afterText: function() {

        },
        buttons: function() {

        }
    },
    className: {
        root: 'dtree',
        opened: 'dtree-opened',
        selected: 'dtree-selected',
        indeterminate: 'dtree-indeterminate',
        handler: 'dtree-handler',
        hasChild: 'dtree-has-child'
    }
};

exports.events = function() {
    var opt = this.module.renderOptions || {},
        obj = {
            'click h-*': 'toggleOpen'
        };

    if (opt.checkbox) {
        D.assign(obj, {
            'click chk-*': 'toggleCheckbox',
            'click icon-*': 'toggleSelect',
            'click text-*': 'toggleSelect'
        });
    } else {
        obj['click node-*'] = 'toggleSelect';
    }

    return D.assign(obj, opt.events);
};

exports.handlers = function() {
    var opt = this.module.renderOptions || {};
    return D.assign({
        toggleOpen: function(id) {
            this.module.dispatch('toggleState', { nodes: id, state: 'opened' });
        },

        toggleCheckbox: function(id) {
            this.module.dispatch('toggleCheckbox', { id: id });
        },

        toggleSelect: function(id) {
            var node = this.bindings.tree.data.map[id],
                el = $(this.module._getElement());  // eslint-disable-line no-underscore-dangle
            if (this.module.treeOptions.checkbox) {
                this.module.dispatch('toggleCheckbox', { id: id });
                return;
            }

            this.module.dispatch('toggleSelect', { id: id }).then(function() {
                el.trigger('change', node);
            });
        }
    }, opt.handlers);
};
