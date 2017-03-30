exports.bindings = {
    knowledge: true,
    collect: true,
    score: true,
    topics: true
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
}, function() {
    var me = this;
    var knowledge = this.bindings.knowledge.data;
    return {
        id: 'star-score',
        name: 'picker',
        options: {
            picker: 'star-score',
            data: {
                id: knowledge.id,
                avgScore: knowledge.avgScore
            },
            callback: function(score) {
                me.module.dispatch('score', { score: score, id: knowledge.id });
            }
        }
    };
}];

exports.actions = {
    'click collect': 'collect',
    'click cancel-collect': 'cancelCollect',
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
    }
};
