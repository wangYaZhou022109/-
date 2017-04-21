var _ = require('lodash/collection');

exports.bindings = {
    list: true,
    export: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'list' }
}];

exports.dataForTemplate = {
    list: function(data) {
        var pageNum = this.bindings.list.getPageInfo().page;
        _.map(data.list || [], function(role, i) {
            var r = role;
            r.i = i + 1 + ((pageNum - 1) * 10);
            r.integralScore = r.integralScore ? r.integralScore : '0';
            r.discussNum = r.discussNum ? r.discussNum : '0';
            r.careNum = r.careNum ? r.careNum : '0';
        });
        return data.list;
    },
    exportUrl: function() {
        var url = this.bindings.export.getFullUrl() + '?',
            token = this.app.global.OAuth.token.access_token;
        url += ('access_token=' + token);
        return url;
    }
};

