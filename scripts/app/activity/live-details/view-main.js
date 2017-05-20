var _ = require('lodash/collection');
var $ = require('jquery');

exports.bindings = {
    gensee: true,
    courses: true,
    down: false,
    sub: true,
    collect: true,
    score: true
};

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

exports.components = [function() { // 分享组件
    var data = {},
        gensee = this.bindings.gensee.data;
    if (gensee) {
        data.id = gensee.id;
        data.type = 5;
        data.pics = gensee.cover ? gensee.cover : 'images/default-cover/default_course.jpg';
        data.title = gensee.subject;
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

exports.actions = {
    'click sub-*': 'subGensee',
    'click cancelsub-*': 'cancelsubGensee',
    'click collect': 'collect',
    'click cancel-collect': 'cancelCollect',
    'click submit-score': 'score',
};

exports.dataForActions = {
    subGensee: function(data) {
        return this.Promise.create(function(resolve) {
            resolve(data);
        });
    },
    cancelsubGensee: function(data) {
        var d = this.Promise.create(function(resolve) {
            resolve(data);
        });
        return d;
    },
    collect: function() {
        var gensee = this.bindings.gensee.data;
        return {
            businessId: gensee.id,
            businessType: 5,
            collectName: gensee.subject
        };
    },
    cancelCollect: function(payload) {
        return payload;
    },

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

exports.dataForTemplate = {
    gensee: function(data) {
        var info = data.gensee,
            lecturers = info.lecturers,
            nameArray = [];
        if (lecturers) {
            nameArray = _.map(lecturers, function(item) {
                return item.lecturerName;
            });
            info.lecturerStr = nameArray.join(',');
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
    },
    score: function(data) {
        var gensee = data.gensee,
            avgScore = 0.0,
            scorePercent = 0;
        if (gensee.avgScore) {
            scorePercent = gensee.avgScore;
            avgScore = (scorePercent / 10).toFixed(1);
        }
        return {
            hasScore: !!gensee.courseScore,
            scorePercent: scorePercent,
            avgScore: avgScore
        };
    }
};

