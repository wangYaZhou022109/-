var _ = require('lodash/collection');
exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    options: function(d) {
        _.map(d.state.options, function(ii, i) {
            var item = ii;
            item.index = i;
            item.code = String.fromCharCode(item.index + 'A'.charCodeAt(0));
        });
        return d.state.options;
    }
};
