exports.items = {
    main: 'main',
    top: 'top',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        concern: { url: '../ask-bar/my-share/findconcern' },
        followcount: { data: { menu: 'followcount' } },
        relevantexperts: { data: { menu: 'relevantexperts' } },
        relatedquestions: { data: { menu: 'relatedquestions' } },
        details: {
            url: '../ask-bar/question-details/share'
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
        praise: { url: '../ask-bar/my-share/praise' }
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
        report: function(payload) {
            var data = payload;
            var report = this.models.report;
            report.set(data);
            return this.post(report);
        },
        // follow: function(payload) {
        //     // var follow = this.models.follow,
        //     //     me = this,
        //     //     expert = this.models.expert;
        //     // follow.set(payload);
        //     // expert.set({ id: this.models.expert.data.id, concernType: '1' });
        //     var follow = this.models.follow;
        //     follow.set(payload);
        //     return this.put(follow);
        //     // return this.post(follow).then(function() {
        //     //     me.app.message.success('关注成功');
        //     //     me.get(expert);
        //     // });
        // },
        follow: function(payload) {
            var follow = this.models.follow,
                me = this,
                details = this.models.details;
            follow.set(payload);
            details.set({ id: this.models.details.data.id, concernType: '1' });
            return this.post(follow).then(function() {
                me.app.message.success('关注成功');
                me.get(details);
            });
        },
        // unfollow: function(payload) {
        //     var unfollow = this.models.unfollow,
        //         me = this,
        //         expert = this.models.expert;
        //     expert.set({ id: this.models.expert.data.id, concernType: '1' });
        //     unfollow.set({ id: payload.id, concernType: '1' });
        //     return this.put(unfollow).then(function() {
        //         me.app.message.success('取消成功');
        //         me.get(expert);
        //     });
        // }
        unfollow: function(payload) {
            var unfollow = this.models.unfollow;
            unfollow.set(payload);
            return this.put(unfollow);
        },
        praise: function(payload) {
            var praise = this.models.praise;
            praise.set(payload);
            return this.put(praise);
        },
        concern: function(payload) {
            var concern = this.models.concern;
            concern.set(payload);
            return this.get(concern);
        },
    }
};

exports.beforeRender = function() {
    this.dispatch('questionDetails', this.renderOptions);
    this.dispatch('concern', this.renderOptions);
};

