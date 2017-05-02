var D = require('drizzlejs');

exports.items = {
    main: 'main',
    modal: ''
};

exports.store = {
    models: {
        list: { url: '../exam/question-depot' },
        state: {}
    },

    callbacks: {
        init: function(payload) {
            var me = this;
            if (payload.data) D.assign(this.models.state.data, payload.data);
            if (payload.params) {
                D.assign(this.models.list.params, payload.params);
                return this.get(this.models.list).then(function() {
                    me.models.state.changed();
                });
            }
            return '';
        },
        selectChanged: function(payload) {
            D.assign(this.models.state.data, {
                id: payload.id,
                name: payload.text,
                text: payload.text
            });
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
            required: this.renderOptions.required
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
    }
};
