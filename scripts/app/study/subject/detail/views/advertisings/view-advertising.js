var _ = require('lodash/collection');
exports.bindings = {
    region: false,
    subject: false,
    download: false
};

exports.components = [{
    id: 'banner',
    name: 'swiper',
    options: {
        autoplay: true
    }
}];

exports.dataForTemplate = {
    advertisings: function(data) {
        var advertisings = data.subject.advertisings,
            me = this;
        _.map(advertisings || [], function(banner) {
            var b = banner;
            b.downUrl = me.bindings.download.getFullUrl() + '?id=' + b.cover;
        });
        return advertisings;
    },
    subject: function(data) {
        var subject = data.subject,
            avgScore = 0;
        if (subject.id) {
            if (subject.avgScore) {
                subject.scorePercent = subject.avgScore;
                avgScore = subject.avgScore / 10;
                subject.avgScore = avgScore.toFixed(1);
            } else {
                subject.scorePercent = 0;
                subject.avgScore = '暂无评分';
            }
        }
        return subject;
    }
};
