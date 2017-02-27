var _ = require('lodash/collection');

exports.bindings = {
    iftrainees: true
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'iftrainees' }
}];

exports.dataForTemplate = {
    iftrainees: function(data) {
        var iftrainees = data.iftrainees,
            pageNum = this.bindings.iftrainees.getPageInfo().page;
        _.map(iftrainees || [], function(iftrainee, i) {
            var e = iftrainee;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return iftrainees;
    }
};
