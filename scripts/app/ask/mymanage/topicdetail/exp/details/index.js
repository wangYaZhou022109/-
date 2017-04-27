exports.items = {
    main: 'main',
    relevantexperts: 'relevantexperts',
    relatedquestions: 'relatedquestions',
    top: 'top',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        followcount: { data: { menu: 'followcount' } },
        relevantexperts: { data: { menu: 'relevantexperts' } },
        relatedquestions: { data: { menu: 'relatedquestions' } },
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
        state: { data: {} },
        follow: {
            url: '../ask-bar/question-details/boutique'
        },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        setEssenceStatus: { url: '../ask-bar/question/essence-status' },
        unEssenceStatus: { url: '../ask-bar/question/essence-status' },
        shut: { url: '../ask-bar/question/close-status' },
        fire: { url: '../ask-bar/question/close-status' },
    },
    callbacks: {
        refreshrelpy: function() {
            this.models.state.changed();
        },
        init: function(payload) {
            // var question = payload.question;
            // this.models.details.set(question);
            var question = this.models.details,
                relevantexperts = this.models.relevantexperts,
                state = this.models.state,
                relatedquestions = this.models.relatedquestions,
                followcount = this.models.followcount,
                data = payload.id.split(',');
            relevantexperts.data.id = data[0];
            relevantexperts.changed();
            relatedquestions.data.id = data[0];
            relatedquestions.changed();
            state.data.id = data[0];
            state.changed();
            followcount.data.id = data[1];
            followcount.changed();
            question.set({ id: data[0] });
            this.get(question);
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
        follow: function(payload) {
            var follow = this.models.follow,
                me = this,
                details = this.models.details;
            follow.set(payload);
            details.set({ id: this.models.details.data.id, concernType: '3' });
            return this.post(follow).then(function() {
                me.app.message.success('关注成功');
                me.get(details);
            });
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow,
                me = this,
                details = this.models.details;
            details.set({ id: this.models.details.data.id, concernType: '3' });
            unfollow.set({ id: payload.id, concernType: '3' });
            return this.put(unfollow).then(function() {
                me.app.message.success('取消成功');
                me.get(details);
            });
        },
        setEssenceStatus: function(payload) {
            this.models.setEssenceStatus.set(payload);
            return this.put(this.models.setEssenceStatus);
        },
        unEssenceStatus: function(payload) {
            this.models.unEssenceStatus.set(payload);
            return this.put(this.models.unEssenceStatus);
        },
        shut: function(payload) {
            this.models.shut.set(payload);
            return this.put(this.models.shut);
        },
        fire: function(payload) {
            this.models.fire.set(payload);
            return this.put(this.models.fire);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('questionDetails', this.renderOptions);
};

