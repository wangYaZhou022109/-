var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');

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
                totalScore = r.totalScore,
                score = r.score;
            r.i = i + 1 + ((pageNum - 1) * 10);
            r.totalScore = totalScore / 100;
            r.score = score / 100;
            r.showCert = r.exam.hasCert === 1;// 是否有证书
            if (r.score >= r.exam.passScore) {
                r.isPass = '是';
            } else {
                r.isPass = '否';
            }
            r.startTimeStr = helpers.dateMinute(r.exam.startTime);
            r.endTimeStr = helpers.dateMinute(r.exam.endTime);
            r.submitTimeStr = helpers.dateMinute(r.submitTime);
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

