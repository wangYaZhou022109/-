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
            var r = role;
            r.i = i + 1 + ((pageNum - 1) * 10);
            r.startTimeStr = helpers.dateMinute(r.researchQuestionary.startTime);
            r.endTimeStr = helpers.dateMinute(r.researchQuestionary.endTime);
            r.createTimeStr = helpers.dateMinute(r.createTime);
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

