exports.bindings = {
};
exports.events = {
    'click watch-detail1': 'watchDtail1',
    'click report-exam': 'reportExam',
    'click watch-detail3': 'watchDtail3',
    'click ask-exam': 'askExam',
    'click discuss-exam': 'discussExam',
    'click exam-pass': 'examPass',
    'click ask-reject': 'askReject',
    'click discuss-reject': 'discussReject',
    'click report-reject': 'reportReject'
};

exports.handlers = {
    watchDtail1: function() {
        var model = this.module.items['ask-new/management/watch-detail1'];
        this.app.viewport.modal(model);
    },
    reportExam: function() {
        var model = this.module.items['ask-new/management/report-exam'];
        this.app.viewport.modal(model);
    },
    watchDtail3: function() {
        var model = this.module.items['ask-new/management/watch-detail3'];
        this.app.viewport.modal(model);
    },
    askExam: function() {
        var model = this.module.items['ask-new/management/ask-exam'];
        this.app.viewport.modal(model);
    },
    discussExam: function() {
        var model = this.module.items['ask-new/management/discuss-exam'];
        this.app.viewport.modal(model);
    },
    examPass: function() {
        var model = this.module.items['ask-new/management/exam-pass'];
        this.app.viewport.modal(model);
    },
    askReject: function() {
        var model = this.module.items['ask-new/management/ask-reject'];
        this.app.viewport.modal(model);
    },
    discussReject: function() {
        var model = this.module.items['ask-new/management/discuss-reject'];
        this.app.viewport.modal(model);
    },
    reportReject: function() {
        var model = this.module.items['ask-new/management/report-reject'];
        this.app.viewport.modal(model);
    }
};
