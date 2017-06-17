var _ = require('lodash/collection');
var $ = require('jquery'),
    GENSEE_SHARE_TYPE = 9;

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
        data.type = GENSEE_SHARE_TYPE;
        data.pics = gensee.cover ? gensee.cover : 'images/default-cover/default_live.jpg';
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
}, function() {
    var me = this;
    var gensee = this.bindings.gensee.data;
    return {
        id: 'star-score',
        name: 'picker',
        options: {
            picker: 'star-score',
            data: {
                id: gensee.id,
                avgScore: gensee.avgScore / 10
            },
            callback: function(score) {
                me.module.dispatch('score', { score: score, businessId: gensee.id, businessType: 5 });
            }
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
    score: function() {
        var data = this.bindings.score.data;
        return data.score ? data : false;
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

