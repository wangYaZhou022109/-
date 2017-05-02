var _ = require('lodash/collection');

exports.bindings = {
    exams: true,
    exam: false,
};

exports.components = [
    { id: 'pager', name: 'pager', options: { model: 'exams' } }
];

exports.dataForTemplate = {
    exams: function(data) {
        var pageNum = this.bindings.exams.getPageInfo().page;
        _.map(data.exams || [], function(role, i) {
            var r = role;
            r.i = i + 1 + ((pageNum - 1) * 10);
        });
        return data.exams;
    }
};
