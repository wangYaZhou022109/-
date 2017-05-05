var _ = require('lodash/collection');

exports.bindings = {
    particularss: true,
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'particularss' }
}];

exports.dataForTemplate = {
    particularss: function(data) {
        var particularss = data.particularss,
            pageNum = this.bindings.particularss.getPageInfo().page;
        _.map(particularss || [], function(particulars, i) {
            var e = particulars;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return particularss;
    },
};
