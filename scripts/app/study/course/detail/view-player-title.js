var $ = require('jquery');

exports.bindings = {
    course: true,
    collect: true,
    score: true
};


exports.events = {
    'click star-*': 'star'
};

exports.components = [function() { // 分享组件
    var data = {},
        course = this.bindings.course.data;
    if (course) {
        data.id = course.id;
        data.type = '1';
        data.pics = 'images/default-cover/default_course.jpg';
        data.title = '经济学人的动态图表与交互设计';
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
    score: function(data) {
        this.module.dispatch('initScore', data[0]).then(function() {
            this.app.message.success('评分成功');
        });
    }
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
