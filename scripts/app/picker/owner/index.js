var _ = require('lodash/collection'),
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

exports.items = {
    main: 'main',
    modal: ''
};

exports.store = {
    models: {
        list: { url: '../system/organization/company-orgs', cache: false },
        state: {}
    },

    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                orgs = this.models.list;

            state.set(payload.data);
            return this.get(orgs).then(function() {
                var node = {};
                if (payload.data.autoFill && !payload.data.id) {
                    node = getFirstNode(orgs.data);
                    state.data.id = node.id;
                    state.data.text = node.text;
                }
                state.changed();
                return '';
            });
        },
        selectTrigger: function(payload) {
            var selectTrigger = this.models.state.data.selectTrigger;
            if (selectTrigger) {
                return selectTrigger(payload);
            }
            return true;
        },
        selectChanged: function(payload) {
            var state = this.models.state;
            if (payload.id !== state.data.id) {
                state.data.id = payload.id;
                state.data.text = payload.text;
                state.changed();
                state.data.selectChanged && state.data.selectChanged(payload);
            }
        }
    }
};

exports.mixin = {
    getValue: function() {
        return this.store.models.state.data.id;
    },
    getText: function() {
        return this.store.models.state.data.text;
    },
    validate: function() {
        return this.items.main.validate();
    },
    getData: function() {
        var data = this.store.models.state.data;
        if (data.id) {
            return { id: data.id, text: data.text };
        }
        return null;
    }
};

exports.afterRender = function() {
    var data = this.renderOptions.data || {},
        inputName = this.renderOptions.inputName || 'organizationId',
        inputTextName = this.renderOptions.inputTextName || 'organizationId-text',
        noLoad = this.renderOptions.noLoad,
        autoFill = !!this.renderOptions.autoFill;
    if (!noLoad) {
        return this.dispatch('init', {
            params: this.renderOptions.params,
            data: {
                id: data.id,
                text: data.text,
                autoFill: autoFill,
                inputName: inputName,
                inputTextName: inputTextName,
                required: this.renderOptions.required,
                readonly: this.renderOptions.readonly,
                selectTrigger: this.renderOptions.selectTrigger,
                selectChanged: this.renderOptions.selectChanged
            }
        });
    }
    return false;
};
