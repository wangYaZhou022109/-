var _ = require('lodash/collection');

exports.items = {
    tags: 'tags'
};

exports.store = {
    models: { state: {} },
    callbacks: {
        init: function() {
            return this.models.state.set({ map: {}, list: [] });
        },

        add: function(payload) {
            var state = this.models.state;
            _.map(payload.items, function(item) {
                if (state.data.map[item.value]) return;
                state.data.map[item.value] = item;
                state.data.list.push(item);
            });
            state.changed();
        },

        remove: function(payload) {
            var state = this.models.state,
                remain = _.filter(state.data.list, function(item) {
                    return payload.values.indexOf(item.value + '') === -1;
                });
            return this.chain(this.module.dispatch('init'), function() {
                return this.module.dispatch('add', { items: remain });
            });
        },

        clear: function() {
            return this.chain(this.module.dispatch('init'), function() {
                this.models.state.changed();
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};

exports.mixin = {
    addItem: function(item) {
        return this.dispatch('add', { items: [item] });
    },

    addItems: function(items) {
        return this.dispatch('add', { items: items });
    },

    removeItem: function(value) {
        return this.dispatch('remove', { values: [value] });
    },

    removeItems: function(values) {
        return this.dispatch('remove', { values: values });
    },

    clear: function() {
        return this.dispatch('clear');
    },

    getValue: function() {
        return _.map(this.store.models.state.data.list, 'value').join(',');
    },

    getData: function() {
        return this.store.models.state.data.list;
    }
};
