var D = require('drizzlejs');

exports.items = {
    main: 'main',
    'picker/position/select-position': { isModule: true }
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        selectChanged: function(payload) {
            var state = this.models.state;
            state.data.id = payload.id;
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
    state.data = D.assign({ inputName: 'positionId' }, this.renderOptions, this.renderOptions.data);
};
