exports.bindings = {
    course: true,
    collect: true
};

exports.actions = {
    'click collect': 'collect',
    'click cancel-collect': 'cancelCollect'
};

exports.dataForActions = {
    collect: function() {
        var course = this.bindings.course.data;
        return {
            businessId: course.id,
            businessType: 1,
            collectName: course.name
        };
    },
    cancelCollect: function(payload) {
        return payload;
    }
};

exports.actionCallbacks = {
    collect: function() {
        this.app.message.success('收藏成功');
    },
    cancelCollect: function() {
        this.app.message.success('取消收藏成功');
    },
};

exports.dataForTemplate = {
    score: function(data) {
        var course = data.course,
            avgScore = 0.0,
            scorePercent = 0;
        if (course.avgScore) {
            scorePercent = course.avgScore;
            avgScore = (scorePercent / 10).toFixed(1);
        }
        return {
            hasScore: !!course.courseScore,
            scorePercent: course.avgScore,
            avgScore: avgScore
        };
    }
};
