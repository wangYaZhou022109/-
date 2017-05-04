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
        window.open(url, '_blank');
    }
};

