exports.items = {
    details: 'details'
};

exports.store = {
    models: {
        state: {},
        report: { url: '../ask-bar/accuse-record/report' }
    },
    callbacks: {
        report: function(payload) {
            var report = this.models.report;
            var data = {};
            data.id = this.models.state.id;
            data.type = payload.type;
            data.accuseNote = payload.accuseNote;
            data.objectType = this.models.state.objectType;
            report.set(data);
            return this.post(data);
        }
    }
};

exports.afterRender = function() {
    this.store.models.state = this.renderOptions.state;
};
