exports.bindings = {
    course: true
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
    collect: function() {
        this.module.dispatch('init', { id: this.bindings.course.data.id }).then(function() {
            this.app.message.success('收藏成功');
        });
    },
    cancelCollect: function() {
        this.module.dispatch('init', { id: this.bindings.course.data.id }).then(function() {
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
