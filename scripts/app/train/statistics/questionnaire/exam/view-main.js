var _ = require('lodash/collection');

exports.bindings = {
    exams: true,
    download: false,
    exam: true
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'exams' }
}];

exports.dataForTemplate = {
    exams: function(data) {
        var exams = data.exams,
            pageNum = this.bindings.exams.getPageInfo().page;
        _.map(exams || [], function(exam, i) {
            var e = exam;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return exams;
    },
    exportUrl: function() {
        var url = this.bindings.download.getFullUrl() + '?';
        var params = this.bindings.exams.params;
        var token = this.app.global.OAuth.token.access_token;
        params.pageSize = 100000;
        params.page = 1;
        _.map(params, function(v, k) {
            url += (k + '=' + v + '&');
        });
        url += ('access_token=' + token);
        return url;
    },
    exam: function(data) {
        return data;
    }
};
