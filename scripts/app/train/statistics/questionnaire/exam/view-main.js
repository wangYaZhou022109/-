var _ = require('lodash/collection');

exports.bindings = {
    exams: true,
    download: false,
    exam: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'exams' }
}];

exports.dataForTemplate = {
    exams: function(data) {
        var exams = data.exams;
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

exports.events = {
    'click edit-exams*': 'edit',
    'click mark-paper-*': 'markPaper'
};

exports.handlers = {
    edit: function(data) {
        var id = data,
            url = '#/exam/exam/score-detail/' + id;
        window.open(url, '_blank');
    },
    markPaper: function(data) {
        var id = data,
            url = '#/exam/exam/mark-paper/' + id;
        window.open(url, '_blank');
    }
};
