exports.bindings = {
    course: true,
    collect: true,
    score: true,
    download: false
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

exports.components = [function() { // 分享组件
    var data = {},
        course = this.bindings.course.data;
    var pics = 'images/default-cover/default_course.jpg';
    if (course) {
        if (course.cover) {
            pics = course.cover;
        }
        data.id = course.id;
        data.type = '1';
        data.pics = pics;
        data.title = course.name;
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
    var course = this.bindings.course.data;
    return {
        id: 'star-score',
        name: 'picker',
        options: {
            picker: 'star-score',
            data: {
                id: course.id,
                avgScore: course.avgScore / 10
            },
            callback: function(score) {
                me.module.dispatch('score', { score: score, businessId: course.id, businessType: 1 });
            }
        }
    };
}];
