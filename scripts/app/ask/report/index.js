
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
        init: function() {
            // var trends = this.models.trends;
          //  trends.set({ id: 1222 });
           // return this.get(trends);
            var me = this;
            return this.get(this.models.trends).then(function() {
                // var callback = me.module.renderOptions.state.callback;

                // if (callback) callback();
                var el = me.module.renderOptions.state.el;
                console.log(el);
            });
        }

    }
};

exports.afterRender = function() {
    this.store.models.state = this.renderOptions.state;
};
