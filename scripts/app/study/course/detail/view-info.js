exports.bindings = {
    course: true,
    collect: true,
    score: true
};

exports.actions = {
    'click collect': 'collect',
    'click cancel-collect': 'cancelCollect'
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
    }
};
