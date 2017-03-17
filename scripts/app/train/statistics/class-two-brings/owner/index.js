var D = require('drizzlejs');

exports.items = {
    main: 'main',
    modal: ''
};

exports.store = {
    models: {
        list: { url: '../system/grant/granted-organization', cache: true },
        state: {}
    },

    callbacks: {
        init: function(payload) {
            this.models.state.set(payload.data, true);
            D.assign(this.models.list.params, payload.params, { uri: payload.name });
            return this.get(this.models.list);
        },
        selectChanged: function(payload) {
            var state = this.models.state;
            state.data.id = payload.id;
            state.data.text = payload.text;
            state.changed();
            state.data.selectChanged && state.data.selectChanged(payload);
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
        noLoad = this.renderOptions.noLoad;
    if (!noLoad) {
        return this.dispatch('init', {
            name: this.renderOptions.module,
            params: this.renderOptions.params,
            data: {
                id: data.id,
                text: data.text,
                inputName: inputName,
                inputTextName: inputTextName,
                required: this.renderOptions.required,
                selectChanged: this.renderOptions.selectChanged
            }
        });
    }
    return false;
};
