var D = require('drizzlejs');

exports.items = {
    main: 'main',
    'picker/member/select-member': { isModule: true }
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        selectChanged: function(payload) {
            var state = this.models.state;
            state.data.value = payload.id;
            state.data.text = payload.name;
            state.changed();
        }
    }
};

exports.mixin = {
    getValue: function() {
        return this.store.models.state.data.id;
    }
};
exports.beforeRender = function() {
    var state = this.store.models.state;
    state.data = D.assign({ inputName: 'memberId' }, this.renderOptions, this.renderOptions.data);
};
