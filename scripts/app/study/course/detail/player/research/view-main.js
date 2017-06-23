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

        if (!progress || progress.finishStatus === 0) {
            research.questionaryDetail = research.questionaryDetail || '该章节为调研问卷,请点击下方按钮参与调研吧';
            research.btn = '参与调研';
        } else {
            research.questionaryDetail = research.questionaryDetail || '您已参与调研,请点击下方按钮查看详情';
            research.btn = '查看详情';
        }
        return research;
    }
};

