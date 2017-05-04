var _ = require('lodash/collection');
exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    options: function(d) {
        var me = this;
        _.map(d.state.options, function(ii, i) {
            var item = ii;
            item.index = i;
            item.code = String.fromCharCode(item.index + 'A'.charCodeAt(0));
            item.mode = me.bindings.state.data.mode;
        });
        return d.state.options;
    },
    showScore: function() {
        return this.module.renderOptions.previewMode === 1;
    }
};

