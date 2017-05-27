var _ = require('lodash/collection');

exports.bindings = {
    gensee: true,
    courses: true,
    down: false
};


exports.dataForTemplate = {
    courses: function(data) {
        var defultImg = 'images/default-cover/default_course.jpg',
            downUrl = this.bindings.down.getFullUrl();
        _.map(data.courses || [], function(item) {
            var info = item,
                scorePercent = 0,
                avgScore = 0.0;
            info.cover = info.cover ? (downUrl + '?id=' + info.cover) : defultImg;
            if (info.avgScore) {
                scorePercent = info.avgScore;
                avgScore = (scorePercent / 10).toFixed(1);
            }
            info.avgScore = avgScore;
        });
        return data.courses;
    }
};

