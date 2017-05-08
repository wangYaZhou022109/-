var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    progressList: true,
    progress: false,
    businessType: false,
    courseName: false
};

exports.actions = {
    'click showDeail-*': 'showDeail'
};

exports.dataForActions = {
    showDeail: function(data) {
        var me = this;
        var courseName = this.$('courseName' + data.id).value;
        me.bindings.courseName.value = courseName;
        me.app.viewport.modal(me.module.items.detail);
        return data;
    }
};


exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'progressList' }
}];

exports.dataForTemplate = {
    progressList: function(data) {
        var pageNum = this.bindings.progressList.getPageInfo().page;
        _.map(data.progressList || [], function(role, i) {
            var r = role;
            r.i = i + 1 + ((pageNum - 1) * 10);
        });
        data.progressList.forEach(function(obj) {
            var progress = obj || {};
            progress.beginTimeStr = helpers.dateMinute(progress.beginTime);
            progress.finishTimeStr = helpers.dateMinute(progress.finishTime);
        });
        return data.progressList;
    },
    exportUrl: function() {
        var url = this.bindings.progress.getFullUrl() + '?',
            businessType = this.bindings.businessType.value,
            token = this.app.global.OAuth.token.access_token;
        url += 'businessType=' + businessType + '&';
        url += ('access_token=' + token);
        return url;
    },
    businessType: function() {
        return this.bindings.businessType.value;
    }
};

