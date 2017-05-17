var _ = require('lodash/collection');

exports.bindings = {
    courseStudyProgresss: true,
    state: true
};

exports.events = {
    'click edit*': 'edit'
};

exports.handlers = {
    edit: function(data, e, target) {
        var me = this;
        var cId = target.getAttribute('cId');
        var view1 = me.module.items['train/statistics/study-details/particulars'];
        var options = {};
        options.memberId = data;
        options.classId = cId;
        me.app.viewport.modal(view1, { payload: options });
    }
};

exports.dataForTemplate = {
    member: function() {
        var member = this.bindings.courseStudyProgresss.data,
            a = 0,
            ss = 0, // 秒
            mm = 0, // 分
            hh = 0, // 小时
            length = '';
        _.map(member || [], function(m, i) {
            var e = m;
            e.i = i + 1;
            a = e.studyTotalTime == null ? 0 : window.parseInt(e.studyTotalTime);
            hh = window.parseInt(a / 3600);
            if (hh < 10) {
                hh = '0' + hh;
            }
            mm = window.parseInt((a - (hh * 3600)) / 60);
            if (mm < 10) {
                mm = '0' + mm;
            }
            ss = window.parseInt((a - (hh * 3600)) % 60);
            if (ss < 10) {
                ss = '0' + ss;
            }
            length = hh + ':' + mm + ':' + ss;
            if (a > 0) {
                e.studyTotalTime = length;
            }
            if (a === 0) {
                e.studyTotalTime = '-';
            }
            return e.studyTotalTime;
        });
        return member;
    },
};
