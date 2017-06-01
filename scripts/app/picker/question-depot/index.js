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
        shareAndPublic: { url: '../exam/question-depot/share-public' }, //  上级允许下级的目录，和 所有公开的
        state: {}
    },

    callbacks: {
        init: function(payload) {
            var me = this,
                list = this.models.list,
                state = this.models.state;

            if (payload.data) D.assign(state.data, payload.data);

            if (payload.params && payload.params.organizationId) {
                D.assign(list.params, payload.params);
                if (payload.params.share) {
                    D.assign(list.params, { share: 1 });
                    return this.get(list).then(function() {
                        me.models.state.changed();
                    });
                }
                return this.get(list).then(function() {
                    var nodes = me.models.list.data,
                        node = getFirstNode(nodes);
                    D.assign(me.models.state.data, {
                        id: node.id,
                        text: node.text
                    });
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

