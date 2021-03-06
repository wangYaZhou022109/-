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
            var r = role,
                lecturerNamesSub = r.genseeWebCast.lecturerNames;
            r.i = i + 1 + ((pageNum - 1) * 10);
            if (lecturerNamesSub && lecturerNamesSub.length > 20) {
                lecturerNamesSub = lecturerNamesSub.substring(0, 20) + '...';
            }
            r.genseeWebCast.lecturerNamesSub = lecturerNamesSub;
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

