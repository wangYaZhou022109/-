var $ = require('jquery');

exports.bindings = {
    knowledge: true,
    collect: true,
    score: true
};
exports.components = [function() { // 分享组件
    var data = {},
        knowledge = this.bindings.knowledge.data;
    if (knowledge) {
        data.id = knowledge.id;
        data.type = '3';
        data.pics = 'images/default-cover/default_course.jpg';
        data.title = knowledge.name;
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
    'click collect': 'collect',
    'click cancel-collect': 'cancelCollect',
    'click submit-score': 'score'
};

exports.dataForActions = {
    collect: function() {
        var knowledge = this.bindings.knowledge.data;
        return {
            businessId: knowledge.id,
            businessType: 7,
            collectName: knowledge.name
        };
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

exports.dataForTemplate = {
    avgScoreFix: function(data) {
        if (data.knowledge.avgScore) {
            return data.knowledge.avgScore * 10;
        }
        return 0;
    }
};
