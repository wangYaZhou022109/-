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
        }
    }
};

exports.afterRender = function() {
    var data = this.renderOptions.data || {},
        inputName = this.renderOptions.inputName || 'organizationId',
        noLoad = this.renderOptions.noLoad;
    if (!noLoad) {
        return this.dispatch('init', {
            name: this.renderOptions.module,
            params: this.renderOptions.params,
            data: { id: data.id, text: data.text, inputName: inputName, required: this.renderOptions.required }
        });
    }
    return false;
};
