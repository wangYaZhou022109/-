var _ = require('lodash/collection');
exports.bindings = {
    list: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'list' }
}];

exports.dataForTemplate = {
    list: function(data) {
        var pageNum = this.bindings.list.getPageInfo().page;
        _.map(data.list || [], function(cinfo, i) {
            var e = cinfo;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return data.list;
    }
};
