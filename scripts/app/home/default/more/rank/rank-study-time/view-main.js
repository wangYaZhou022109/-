var _ = require('lodash/collection');
exports.bindings = {
    studyRank: true,
    myRankCount: true
};
exports.dataForTemplate = {
    rankModule: function(data) {
        var rankModule = data.moduleHomeConfig || {};
        rankModule = this.module.renderOptions.rankModule;
        return rankModule;
    },
    studyRank: function(data) {
        var studyRank = data.studyRank;
        _.map(studyRank, function(rank, i) {
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

            // if (this.app.global.currentUser.id) {
            //     if (r.memberId === this.app.global.currentUser.id) {
            //         // me.bindings.ranking = '';
            //     }
            // }
            r.i = i + 1;
        });
        return studyRank;
    }
};

exports.events = {
    'click details-*': 'detail'
};

exports.handlers = {
    detail: function(id) {
        this.app.viewport.closeModal();
        window.location.href = '#/ask/questiondetails/' + id;
    }
};
