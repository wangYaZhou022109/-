var _ = require('lodash/collection');

exports.bindings = {
    progressList: true,
    progress: false,
    businessType: false
};

exports.actions = {
    'click showDeail-*': 'showDeail'
};

exports.dataForActions = {
    showDeail: function(data) {
        var me = this;
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
            var progress = obj || {},
                time = '',
                second = window.parseInt(progress.studyTotalTime), // 秒
                minute = 0, // 分
                hour = 0; // 小时
            if (second > 60) {
                minute = window.parseInt(second / 60);
                second = window.parseInt(second % 60);
                if (minute > 60) {
                    hour = window.parseInt(minute / 60);
                    minute = window.parseInt(minute % 60);
                }
            }
            time = second;
            if (minute > 0) {
                time = minute + ':' + time;
            }
            if (hour > 0) {
                time = hour + ':' + time;
            }
            progress.studyTotalTime = time;
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
    }
};

