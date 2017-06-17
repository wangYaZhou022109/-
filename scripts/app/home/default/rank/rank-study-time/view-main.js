var _ = require('lodash/collection');
exports.bindings = {
    studyRank: true
};
exports.dataForTemplate = {
    rankModule: function(data) {
        var rankModule = data.moduleHomeConfig || {};
        rankModule = this.module.renderOptions.rankModule;
        return rankModule;
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

exports.events = {
    'click more-*': 'more',
    'click detail-*': 'showDetails'
};

exports.handlers = {
    more: function() {
        // this.app.navigate('home/more/rank-topic/' + payload, true);
        var mod = this.module.items['home/default/more/rank/rank-study-time'],
            me = this;
        me.app.viewport.modal(mod, { rankModule: this.module.renderOptions.rankModule });
    },
    showDetails: function(payload) {
        window.location.href = '#/ask/topicdetail/' + payload;
        // this.app.show('content', 'ask/mymanage/topicdetail', { id: payload });
    }
};
