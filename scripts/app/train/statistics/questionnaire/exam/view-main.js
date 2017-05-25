var _ = require('lodash/collection');

exports.bindings = {
    exams: true,
    download: false,
    exam: true,
    state: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'exams' }
}];

exports.dataForTemplate = {
    exams: function(data) {
        var exams = data.exams,
            pageNum = this.bindings.exams.getPageInfo().page,
            state = this.bindings.state.data;
        _.map(exams || [], function(t, i) {
            var e = t;
            e.i = i + 1 + ((pageNum - 1) * 10);
            e.isGrant = {};
            if (state.role !== 3 && state.role !== 4) {
                e.isGrant = true;
            } else {
                e.isGrant = false;
            }
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
    },
    isGrant: function() {   // 通过角色判断是否有操作权限
        var state = this.bindings.state.data;
        if (state.role !== 3 && state.role !== 4) {
            return true;
        }
        return false;
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
