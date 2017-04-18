var _ = require('lodash/collection'),
    $ = require('jquery');
exports.bindings = {
    region: false,
    subject: true,
    collect: true,
    score: true,
    download: false,
    state: false
};

exports.components = [{
    id: 'banner',
    name: 'swiper',
    options: {
        autoplay: true
    }
}, function() { // 分享组件
    var data = {},
        subject = this.bindings.subject.data;
    if (subject) {
        data.id = subject.id;
        data.type = '8';
        data.pics = subject.cover || 'images/default-cover/default_spceial.jpg';
        data.title = subject.name;
    }
    return {
        id: 'share',
        name: 'picker',
        options: {
            picker: 'share',
            data: data
        }
    };
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
            if (b.linkType === 0) {
                b.linkUrl = '#/news/detail/' + b.id + '/1';
            }
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
    score: function() {
        this.app.message.success('评分成功');
    }
};
