var _ = require('lodash/collection');
exports.bindings = {
    studyRank: true
};

exports.dataForTemplate = {
    moduleHomeConfig: function(data) {
        var moduleHomeConfig = data.moduleHomeConfig || {};
        moduleHomeConfig = this.module.renderOptions.rankModuleConfig;
        return moduleHomeConfig;
    },
    studyRank: function(data) {
        var studyRank = data.studyRank;
        _.map(studyRank, function(rank) {
            var r = rank,
                time = '',
                second = 0, // 秒
                minute = 0, // 分
                hour = 0; // 小时
            second = r.studyTotalTime == null ? 0 : window.parseInt(r.studyTotalTime);
            if (second > 60) {
                minute = window.parseInt(second / 60);
                second = window.parseInt(second % 60);
                if (minute > 60) {
                    hour = window.parseInt(minute / 60);
                    minute = window.parseInt(minute % 60);
                }
                if (second >= 30) {
                    minute += 1;
                }
            }
            time = second;
            if (minute > 0) {
                time = minute + '分';// + time;
            }
            if (hour > 0) {
                time = hour + '小时' + time;
            }
            r.time = time;
        });
        return studyRank;
    }
};
