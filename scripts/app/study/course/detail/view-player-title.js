var $ = require('jquery');

exports.bindings = {
    course: true,
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

exports.actions = {
    'click collect': 'collect',
    'click cancel-collect': 'cancelCollect',
    'click submit-score': 'score'
};

exports.dataForActions = {
    cancelCollect: function(payload) {
        return payload;
    }
};

exports.actionCallbacks = {
    collect: function(data) {
        var collect = this.bindings.collect;
        collect.set(data[0]);
        collect.changed();
        this.app.message.success('收藏成功');
    },
    cancelCollect: function() {
        this.module.dispatch('initCollect', { courseId: this.bindings.course.data.id }).then(function() {
            this.app.message.success('取消收藏成功');
        });
    },
    score: function(data) {
        this.module.dispatch('initScore', data[0]).then(function() {
            this.app.message.success('评分成功');
        });
    }
};

exports.dataForTemplate = {
    score: function(data) {
        return data.score;
    }
};
