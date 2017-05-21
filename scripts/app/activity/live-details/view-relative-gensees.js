var _ = require('lodash/collection');

exports.bindings = {
    relativeGensees: true,
    down: false
};

exports.dataForTemplate = {
    relativeGensees: function(data) {
        var downUrl = this.bindings.down.getFullUrl();
        var defultImg = 'images/default-cover/default_live.jpg';
        _.map(data.relativeGensees || [], function(item) {
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
        return data.relativeGensees;
    }
};

