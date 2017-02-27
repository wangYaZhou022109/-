var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    has = Object.prototype.hasOwnProperty,
    openByLevel,
    matchObject;

openByLevel = function(nodes, level, state) {
    if (level === 0) return;
    _.map(nodes, function(node) {
        state.setState(node.id, 'opened', true);
        openByLevel(node.children, level - 1, state);
    });
};

matchObject = function(obj, target) {
    return _.every(target, function(v, k) {
        if (!has.call(obj, k)) return false;
        if (v !== obj[k]) {
            if (!obj[k] || !obj[k].indexOf) return false;
            if (obj[k].indexOf(v) === -1) return false;
        }
        return true;
    });
};

exports.items = {
    main: 'main'
};

exports.beforeRender = function() {
    this.treeOptions = this.moduleOptions || this.renderOptions;
    if (!this.treeOptions.idKey) this.treeOptions.idKey = 'id';
    if (!this.treeOptions.textKey) this.treeOptions.textKey = 'name';
    if (!this.treeOptions.parentKey) this.treeOptions.parentKey = 'parentId';
};

exports.store = {
    models: {
        tree: {
            data: { map: {}, list: [] },
            mixin: {
                reset: function() {
                    this.data = { map: {}, list: [] };
                },
                create: function(item) {
                    var obj = {
                        id: item[this.module.treeOptions.idKey],
                        text: item[this.module.treeOptions.textKey],
                        parent: item[this.module.treeOptions.parentKey],
                        data: item,
                        children: []
                    };
                    this.data.map[obj.id] = obj;
                    return obj;
                },
                add: function(node) {
                    if (!node.parent || !this.data.map[node.parent]) {
                        this.data.list.push(node);
                    } else {
                        this.data.map[node.parent].children.push(node);
                    }
                }
            }
        },
        state: {
            data: {},
            mixin: {
                setState: function(id, state, value) {
                    this.data[id] || (this.data[id] = {});
                    this.data[id][state] = value;
                },
                toggle: function(id, state) {
                    this.data[id] || (this.data[id] = {});
                    this.data[id][state] = !this.data[id][state];
                    return this.data[id][state];
                },
                getState: function(id, state) {
                    if (!this.data[id]) return false;
                    return this.data[id][state];
                }
            }
        }
    },

    callbacks: {
        reset: function(payload) {
            var tree = this.models.tree,
                state = this.models.state,
                options = this.module.treeOptions,
                nodes,
                openLevel;

            tree.reset();
            state.clear();

            nodes = _.map(payload.nodes, function(item) { return tree.create(item); });
            _.map(nodes, function(node) { tree.add(node); });
            _.map(payload.selected, function(item) {
                var openIt = function(node) {
                    if (!node) return;
                    state.setState(node.id, 'opened', true);
                    openIt(tree.data.map[node.parent]);
                };
                state.setState(item, 'selected', true);
                openIt(tree.data.map[tree.data.map[item].parent]);
            });
            _.map(payload.opened, function(item) { state.setState(item, 'opened', true); });

            openLevel = options.openLevel == null ? 2 : options.openLevel;
            openByLevel(tree.data.list, openLevel, state);

            if (options.checkbox) {
                _.map(payload.indeterminate, function(item) { state.setState(item, 'selected', 2); });
            }
            tree.changed();
        },
        changeState: function(payload) {
            if (D.isArray(payload.nodes)) {
                _.map(payload.nodes, function(id) { this.models.state.setState(id, payload.state, payload.value); });
            } else {
                this.models.state.setState(payload.nodes, payload.state, payload.value);
            }
            this.models.state.changed();
        },
        toggleState: function(payload) {
            if (D.isArray(payload.nodes)) {
                _.map(payload.nodes, function(id) { this.models.state.toggle(id, payload.state); });
            } else {
                this.models.state.toggle(payload.nodes, payload.state);
            }
            this.models.state.changed();
        },
        hideChildren: function(payload) {
            var state = this.models.state,
                map = this.models.tree.data.map,
                hiddenDown = function(node, s) {
                    var i;
                    state.setState(node.id, 'hiddend', s); // 将所有向下的节点设置selected为s
                    for (i = 0; i < node.children.length; i++) {
                        hiddenDown(node.children[i], s);
                    }
                };
            hiddenDown(map[payload.id], payload.status);
            state.setState(payload.id, 'hideChildren', payload.status);
            state.setState(payload.id, 'hiddend', !payload.status);
            this.models.state.changed();
        },
        toggleCheckbox: function(payload) {
            var id = payload.id,
                state = this.models.state,
                map = this.models.tree.data.map,
                cascadeUp = function(node) {
                    var s = 3,
                        i, t;

                    if (!node) return;
                    for (i = 0; i < node.children.length; i++) {
                        t = state.getState(node.children[i].id, 'selected');
                        if (t === 2) {
                            s = 2;
                            break;
                        }
                        if (!t) {
                            s = (s === 1 ? 2 : 0);
                        } else {
                            s = (s === 0 ? 2 : 1);
                        }
                        if (s === 2) break;
                    }

                    state.setState(node.id, 'selected', s);
                    cascadeUp(map[node.parent]);
                },
                cascadeDown = function(node, s) {
                    var i;
                    state.setState(node.id, 'selected', s); // 将所有向下的节点设置selected为s
                    for (i = 0; i < node.children.length; i++) {
                        cascadeDown(node.children[i], s);
                    }
                },
                selected;

            if (has.call(payload, 'selected')) {
                selected = payload.selected;
            } else {
                selected = state.getState(id, 'selected');
                selected = (selected === 2 ? 1 : !selected); // 如果部分选中，设为全部选中，否则设为相反
            }
            state.setState(id, 'selected', selected);

            if (this.module.treeOptions.cascadeUp !== false) {
                cascadeUp(map[map[id].parent]);
            }

            if (this.module.treeOptions.cascadeDown !== false) {
                cascadeDown(map[id], selected);
            }
            this.models.state.changed();
        },
        toggleSelect: function(payload) {
            var state = this.models.state;
            _.map(this.module.getSelected(), function(v) {
                state.toggle(v, 'selected');
            });
            state.toggle(payload.id, 'selected');
            state.changed();
        },
        filter: function(payload) {
            var condition = payload.condition,
                matchedParentLevel = this.module.treeOptions.matchedParentLevel || 100,
                state = this.models.state,
                map = this.models.tree.data.map,
                cascadeUp = function(node, level) {
                    if (level === 0 || !node) return;
                    state.setState(node.id, 'unmatched', false);
                    cascadeUp(map[node.parent], level - 1);
                },
                cascadeDown = function(nodes) {
                    _.map(nodes, function(node) {
                        var matched = matchObject(node.data, condition);
                        state.setState(node.id, 'unmatched', !matched);
                        if (matched) cascadeUp(map[node.parent], matchedParentLevel);
                        cascadeDown(node.children);
                    });
                };

            cascadeDown(this.models.tree.data.list);
            state.changed();
        }
    }
};

exports.mixin = {
    reset: function(nodes, selected, opened, indeterminate) {
        return this.dispatch('reset', {
            nodes: nodes,
            selected: selected,
            opened: opened,
            indeterminate: indeterminate
        });
    },
    open: function(nodeIds) {
        return this.dispatch('changeState', { nodes: nodeIds, state: 'opened', value: true });
    },
    close: function(nodeIds) {
        return this.dispatch('changeState', { nodes: nodeIds, state: 'opened', value: false });
    },
    select: function(nodeIds) {
        return this.dispatch('changeState', { nodes: nodeIds, state: 'selected', value: true });
    },
    // 添加选择并返还第一个节点
    selectRoot: function() {
        var root = null;
        if (this.store.models.tree.data.list.length > 0) {
            root = this.store.models.tree.data.list[0];
            this.select(root.id);
        }
        return root;
    },
    deselect: function(nodeIds) {
        return this.dispatch('changeState', { nodes: nodeIds, state: 'selected', value: false });
    },
    getValue: function() {
        var ids = [];
        if (this.treeOptions.checkbox) {
            return this.getSelected().join('');
        }
        _.forEach(this.store.models.tree.data.map, function(v, k) {
            ids.push(k);
        });
        return ids.join('');
    },
    getSelected: function() {
        var result = [];
        _.map(this.store.models.state.data, function(v, k) {
            if (v.selected && v.selected !== 2 && (!v.hiddend)) {
                result.push(k);
            }
        });
        return result;
    },
    getSelectedNode: function() {
        var result = [],
            map = this.store.models.tree.data.map;
        _.map(this.store.models.state.data, function(v, k) {
            if (v.selected && v.selected !== 2 && (!v.hiddend)) {
                result.push(map[k]);
            }
        });
        return result;
    },
    getIndeterminate: function() {
        return this.getByState('selected', 2);
    },
    getIndeterminateNode: function() {
        return this.getNodeByState('selected', 2);
    },
    getByState: function(state, value) {
        var result = [];
        _.map(this.store.models.state.data, function(v, k) {
            if (v[state] === value) {
                result.push(k);
            }
        });
        return result;
    },
    getNodeByState: function(state, value) {
        var result = [],
            map = this.store.models.tree.data.map;
        _.map(this.store.models.state.data, function(v, k) {
            if (v[state] === value) {
                result.push(map[k]);
            }
        });
        return result;
    },
    hideChildren: function(id) {
        return this.dispatch('hideChildren', { id: id, status: true });
    },
    showChildren: function(id) {
        return this.dispatch('hideChildren', { id: id, status: false });
    },
    filter: function(obj) {
        return this.dispatch('filter', { condition: obj });
    }
};
