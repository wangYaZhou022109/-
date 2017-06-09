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
