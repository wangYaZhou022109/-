var _ = require('lodash/collection'),
    $ = require('jquery');
exports.bindings = {
    region: false,
    subject: false,
    collect: true,
    score: true,
    download: false
};

exports.components = [{
    id: 'banner',
    name: 'swiper',
    options: {
        autoplay: true
    }
}];

exports.events = {
    'click star-*': 'star'
};

exports.handlers = {
    star: function(star, e, target) {
        var score = this.bindings.score;
        score.data.score = star;
        $(target).parent().addClass('active');
        $(target).siblings().removeClass('active');
        $(target).addClass('active');
    }
};

exports.actions = {
    'click collect': 'collect',
    'click cancel-collect': 'cancelCollect',
    'click submit-score': 'score'
};

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
        subject.hasScore = !!subject.courseScore;
        return subject;
    }
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
    },
    score: function(data) {
        this.module.dispatch('initScore', data[0]).then(function() {
            this.app.message.success('评分成功');
        });
    }
};
