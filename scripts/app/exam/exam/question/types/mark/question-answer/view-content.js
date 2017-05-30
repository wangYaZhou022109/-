var CHAR_DIFF = 9263,
    D = require('drizzlejs');

exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    state: function(data) {
        var indexType = this.module.renderOptions.indexType,
            state = data.state;
        if (indexType && indexType === 1) {
            return D.assign(state, {
                index: String.fromCharCode(CHAR_DIFF + (state.index + '').charCodeAt(0))
                    + '【' + state.type + '】'
            });
        }
        return D.assign(state, {
            index: state.index + '：'
        });
    }
};
