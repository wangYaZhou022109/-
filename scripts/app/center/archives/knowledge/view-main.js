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
            if (!r.integralScore) {
                r.integralScore = '-';
            }
            if (!r.downloadMemberCount) {
                r.downloadMemberCount = '-';
            }
            if (!r.browseCount) {
                r.browseCount = '-';
            }
            if (!r.browseMemberCount) {
                r.browseMemberCount = '-';
            }
            if (r.type === '0' || r.type === '1') {
                r.type = '音／视频';
            } else {
                r.type = '文档';
            }
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

