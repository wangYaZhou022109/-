exports.events = {
    'click twobring': 'showTwobring',
    'click businfo': 'showBusinfo',
    'click commitwork': 'showCommitwork',
    'click surveyexam': 'showSurveyexam'
};

exports.handlers = {
    showTwobring: function() {
        var model = this.module.items['activity/class-details/twobring'];
        this.app.viewport.modal(model);
    },
    showBusinfo: function() {
        var model = this.module.items['activity/class-details/businfo'];
        this.app.viewport.modal(model);
    },
    showCommitwork: function() {
        var model = this.module.items['activity/class-details/commitwork'];
        this.app.viewport.modal(model);
    },
    showSurveyexam: function() {
        var model = this.module.items['activity/class-details/surveyexam'];
        this.app.viewport.modal(model);
    }
};
