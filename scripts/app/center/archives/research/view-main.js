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
                rStatus = r.researchQuestionary.status,
                pStatus = r.status;
            r.i = i + 1 + ((pageNum - 1) * 10);
            r.statusStr = '';

            if (rStatus === 1) {
                r.statusStr = '未参与';
            } else if (rStatus === 2) {
                r.statusStr = '待开始';
            } else if (rStatus === 3) {
                if (pStatus === 1) {
                    r.statusStr = '已完成';
                } else {
                    r.statusStr = '待参加';
                }
            } else if (rStatus === 4 || rStatus === 5) {
                if (pStatus === 1) {
                    r.statusStr = '已完成';
                } else {
                    r.statusStr = '未参加';
                }
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

