exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        details: {
            url: '../ask-bar/question-details'
        },
        enjoy: {
            url: '../ask-bar/question-details/enjoy'
        },
        report: {
            url: '../ask-bar/question-details/report'
        },
        boutique: {
            url: '../ask-bar/question-details/boutique'
        },
        discuss: { url: '../ask-bar/question-discuss' },
        reply: { url: '../ask-bar/question-reply' },
        setEssenceStatus: { url: '../ask-bar/question/essence-status' },
        shut: { url: '../ask-bar/question/close-status' },
        state: { data: {} }
    },
    callbacks: {
        refreshrelpy: function() {
            this.models.state.changed();
        },
        init: function(payload) {
            var question = payload.question;
            this.models.details.set(question);
        },
        questionDetails: function(payload) {
            var details = this.models.details,
                data = payload;
            details.set({ id: data.id });
            return this.get(details);
        },
        details: function(payload) {
            var details = this.models.details;
            details.set(payload);
            return this.get(details);
        },
        refresh: function(payload) {
            var details = this.models.details,
                data = {};
            data.id = payload[0].id;
            details.set(data);
            return this.get(details);
        },
        close: function(payload) {
            var close = this.models.details;
            close.set(payload);
            return this.del(close);
        },
        boutique: function(payload) {
            var boutique = this.models.boutique;
            boutique.set(payload);
            return this.post(boutique);
        },
        discuss: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        },
        discussdel: function(payload) {
            var discussdel = this.models.discuss;
            discussdel.set(payload);
            return this.del(discussdel);
        },
        discusstop: function(payload) {
            var discusstop = this.models.discuss;
            var data = payload;
            data.topsStatus = 1;
            discusstop.set(data);
            return this.post(discusstop);
        },
        discussboutique: function(payload) {
            var data = payload;
            var discussboutique = this.models.discuss;
            data.essenceStatus = 1;
            discussboutique.set(data);
            return this.post(discussboutique);
        },
        enjoy: function(payload) {
            var data = payload;
            var enjoy = this.models.enjoy;
            enjoy.set(data);
            return this.post(enjoy);
        },
        report: function(payload) {
            var data = payload;
            var report = this.models.report;
            report.set(data);
            return this.post(report);
        },
        setEssenceStatus: function(payload) {
            this.models.setEssenceStatus.set(payload);
            return this.put(this.models.setEssenceStatus);
        },
        shut: function(payload) {
            this.models.shut.set(payload);
            return this.put(this.models.shut);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('questionDetails', this.renderOptions);
};

