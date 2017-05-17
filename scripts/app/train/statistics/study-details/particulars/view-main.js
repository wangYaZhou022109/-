var _ = require('lodash/collection');

exports.bindings = {
    particularss: true,
    onLine: true
};
exports.dataForTemplate = {
    particularss: function() {
        var particularss = this.bindings.particularss.data,
            onLine = this.bindings.onLine.data,
            a = 0,
            ss = 0, // 秒
            mm = 0, // 分
            hh = 0, // 小时
            length = '';
        _.map(particularss || [], function(m, i) {
            var e = m;
            var cId = m.courseInfo.id;
            e.isRequired = _.find(onLine || [], ['resourceId', cId]).isRequired;
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
        return particularss;
    },
};
