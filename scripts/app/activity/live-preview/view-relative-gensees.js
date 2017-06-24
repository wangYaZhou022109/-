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
                avgScore = 0;
            info.cover = info.cover ? (downUrl + '?id=' + info.cover) : defultImg;
            if (info.avgScore) {
                avgScore = info.avgScore / 10;
            }
            info.avgScore = avgScore;
        });
        return data.relativeGensees;
    }
};

