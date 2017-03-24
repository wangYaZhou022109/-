var _ = require('lodash/collection');
exports.bindings = {
    fmtrainees: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'fmtrainees' }
}];

exports.dataForTemplate = {
    fmtrainees: function(data) {
        var pageNum = this.bindings.fmtrainees.getPageInfo().page;
        _.map(data.fmtrainees || [], function(cinfo, i) {
            var e = cinfo;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return data.fmtrainees;
    }
};
