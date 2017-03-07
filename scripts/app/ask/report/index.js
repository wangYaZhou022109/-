
exports.items = {
    details: 'details'
};

exports.store = {
    models: {
        state: {},
        trends: { url: '../ask-bar/trends/all-dynamic/1' },
        report: { url: '../ask-bar/accuse-record/report' }
    },
    callbacks: {
        report: function(payload) {
            var report = this.models.report;
            var data = payload;
            data.id = this.models.state.id;
            data.objectType = this.models.state.objectType;
            report.set(data);
            return this.save(report);
        },
        close: function() {
            var state = this.module.renderOptions.popupstate;
            state.hidden = false;
            state.data = {};
            state.data.title = '举报';
            state.data.menu = 'report';
            state.data.report = true;
            state.changed();
        }

    }
};

exports.afterRender = function() {
    console.log(this.renderOptions);
    this.store.models.state = this.renderOptions.state;
};
