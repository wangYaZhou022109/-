exports.bindings = {
    researchActivity: true
};

exports.events = {
    'click submit': 'process'
};
exports.handlers = {
    process: function() {
        var id = this.bindings.researchActivity.data.id,
            courseId = this.module.renderOptions.section.courseId,
            url = '#/exam/research-activity/paper/' + id + '/' + courseId;
        var callback = this.module.renderOptions.updateProgress;
        var winOpen = window.open(url, '_blank');
        var timer = setInterval(function() {
            if (winOpen.closed) {
                clearInterval(timer);
                setTimeout(callback, 3000);
            }
        }, 1000);
    }
};

exports.dataForTemplate = {
    researchActivity: function(data) {
        var research = data.researchActivity;
        var progress = this.module.renderOptions.progress;
        if (research.questionaryDetail) return research;

        if (!progress || progress.finishStatus === 0) {
            research.questionaryDetail = '该章节为评估问卷,请点击下方按钮参与评估吧';
        } else {
            research.questionaryDetail = '您已参与评估,请点击下方按钮查看详情';
        }
        return research;
    }
};
