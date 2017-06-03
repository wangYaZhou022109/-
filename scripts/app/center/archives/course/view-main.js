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
        var pageNum = this.bindings.progressList.getPageInfo().page,
            businessType = this.bindings.businessType.value || 0;
        return _.map(data.progressList || [], function(role, i) {
            var r = role;
            r.i = i + 1 + ((pageNum - 1) * 10);
            r.busType = businessType;
            r.beginTimeStr = helpers.dateMinute(r.beginTime);
            r.finishTimeStr = helpers.dateMinute(r.finishTime);
            if (businessType !== 0) {
                r.studyStatusStr = r.finishStatus === 0 || !r.beginTime ? '未学习' : '已学习';
            }
            return r;
        });
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
