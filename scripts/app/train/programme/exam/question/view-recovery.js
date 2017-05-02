var _ = require('lodash/collection');

exports.bindings = {
    recovery: true
};

exports.title = '纠错详情';

exports.dataForTemplate = {
    questionRecoverys: function() {
        return _.map(this.bindings.recovery.data, function(r, n) {
            var rr = r;
            rr.i = n + 1;
            return rr;
        });
    }
};
