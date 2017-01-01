exports.bindings = {
    course: true,
    collect: true
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

exports.dataForTemplate = {
    course: function(data) {
        var course = data.course,
            avgScore = 0;
        if (course.id) {
            if (course.avgScore) {
                course.scorePercent = course.avgScore;
                avgScore = course.avgScore / 10;
                course.avgScore = avgScore.toFixed(1);
            } else {
                course.scorePercent = 0;
            }
        }
        return course;
    }
};
