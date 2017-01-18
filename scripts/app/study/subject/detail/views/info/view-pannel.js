exports.bindings = {
    region: false,
    collect: true,
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

exports.actions = {
    'click collect': 'collect',
    'click cancel-collect': 'cancelCollect'
};

exports.dataForActions = {
    collect: function() {
        var subject = this.bindings.subject.data;
        return {
            businessId: subject.id,
            businessType: 1,
            collectName: subject.name
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
    }
};
