var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    getFirstNode;

exports.items = {
    main: 'main',
    modal: ''
};

exports.store = {
    models: {
        list: {
            url: '../exam/question-depot',
            mixin: {
                merge: function(list) {
                    var me = this,
                        obj = {};
                    _.forEach(list, function(l) {
                        me.data.push(l);
                    });
                    _.forEach(this.data, function(d) {
                        obj[d.id] = d;
                    });
                    this.data = _.map(obj, function(v) {
                        return v;
                    });
                }
            }
        },
        state: {}
    },

    callbacks: {
        init: function(payload) {
            var me = this,
                list = this.models.list,
                state = this.models.state;

            if (payload.data) D.assign(state.data, payload.data);

            //  根据组织ID查询对应目录
            if (payload.params && payload.params.organizationId) {
                D.assign(list.params, payload.params);
                //  是否开关允许下级部门的目录或者公开的目录
                if (payload.params.share) {
                    D.assign(list.params, { share: 1 });
                    return this.get(list).then(function() {
                        var node = getFirstNode(list.data);
                        //  场景：选择试题选择器，选择部门后出发刷新目录，默认选择第一个
                        if (payload.params.autoFill) {
                            D.assign(state.data, {
                                id: node.id,
                                text: node.text
                            });
                        }
                        me.models.state.changed();
                    });
                }
                //  场景： 新增试题目录
                D.assign(list.params, { share: null });
                return this.get(list).then(function() {
                    var nodes = list.data,
                        node = getFirstNode(nodes);
                    //  判断是否默认选中值
                    if (state.data.text && payload.params.autoFill) {
                        D.assign(state.data, {
                            id: payload.data.id,
                            text: payload.data.text
                        });
                    } else if ((!state.data.text || state.data.text !== node.text)
                        && payload.params.autoFill) {
                        D.assign(state.data, {
                            id: node.id,
                            text: node.text
                        });
                    }
                    me.models.state.changed();
                });
            }
            return '';
        },
        selectChanged: function(payload) {
            var state = this.models.state;
            D.assign(state.data, {
                id: payload.id,
                name: payload.text,
                text: payload.text,
                path: payload.data.path || ''
            });
            state.data.selectChanged && state.data.selectChanged(payload);
            state.changed();
        },
        clear: function() {
            this.models.state.data.id = '';
            this.models.state.data.text = '';
            this.models.state.changed();
        },
        clearPicker: function() {
            var state = this.models.state;
            state.data.id = '';
            state.data.text = '';
            state.changed();
        }
    }
};

exports.afterRender = function() {
    var data = this.renderOptions.data || {},
        inputName = this.renderOptions.inputName || 'questionDepotId';

    return this.dispatch('init', {
        params: this.renderOptions.params,
        data: {
            id: data.id,
            text: data.name,
            inputName: inputName,
            required: this.renderOptions.required,
            selectChanged: this.renderOptions.selectChanged
        }
    });
};

exports.mixin = {
    validate: function() {
        return this.items.main.validate();
    },
    getData: function() {
        var data = this.store.models.state.data;
        if (data.id) {
            return data;
        }
        return null;
    },
    clear: function() {
        return this.dispatch('clear');
    },
    reset: function(params) {
        return this.dispatch('init', { params: params });
    }
};

getFirstNode = function(nodes) {
    var d = { map: {}, list: [] };
    _.map(nodes, function(item) {
        d.map[item.id] = item;
    });
    _.map(nodes, function(item) {
        if (!item.parentId || !d.map[item.parentId]) {
            d.list.push(d.map[item.id]);
        }
    });
    if (d.list.length) {
        return { id: d.list[0].id, text: d.list[0].name };
    }
    return {};
};

