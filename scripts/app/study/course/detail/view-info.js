var $ = require('jquery');
exports.bindings = {
    course: true,
    collect: false,
    score: true,
    download: false,
    topics: true
};

exports.events = {
    'click collect': 'collect',
};
exports.handlers = {
    collect: function(e, element) {
        var course = this.bindings.course.data;
        var collecId = element.getAttribute('data-collect-id');
        if (collecId) {
            this.chain(
                this.module.dispatch('cancelCollect', { id: collecId }),
                function() {
                    element.setAttribute('data-collect-id', '');
                    this.app.message.success('取消收藏成功');
                }
            );
        } else {
            this.chain(
                this.module.dispatch('collect', {
                    businessId: course.id,
                    businessType: 1,
                    collectName: course.name
                }),
                function(data) {
                    element.setAttribute('data-collect-id', data[0].id);
                    this.app.message.success('收藏成功');
                }
            );
        }
        $(element).toggleClass('icon-favorite-full');
        $(element).toggleClass('custom-color-1');
        $(element).toggleClass('icon-favorite');
    }
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
