exports.bindings = {
    region: false,
    subject: false
};

exports.dataForTemplate = {
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
