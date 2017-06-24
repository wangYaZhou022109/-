var _ = require('lodash/collection');

exports.bindings = {
    gensee: true,
    down: false
};

exports.dataForTemplate = {
    gensee: function(data) {
        var gensee = data.gensee,
            lecturers = gensee.lecturers,
            nameArray = [];
        if (lecturers) {
            nameArray = _.map(lecturers, function(item) {
                return item.lecturerName;
            });
            gensee.lecturerStr = nameArray.join(',');
        }
        return data.gensee;
    },
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

