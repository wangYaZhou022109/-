var _ = require('lodash/collection');
exports.items = {
    main: 'main',
    relevantexperts: 'relevantexperts',
    relatedquestions: 'relatedquestions',
    top: 'top',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        img: { url: '../system/file/upload' },
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
        discuss: { url: '../ask-bar/question-discuss/discuss' },
        discussd: { url: '../ask-bar/question-discuss' },
        reply: { url: '../ask-bar/question-reply' },
        state: { data: {} },
        follow: {
            url: '../ask-bar/question-details/boutique'
        },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        praise: { url: '../ask-bar/my-share/praise' },
        unpraise: { url: '../ask-bar/my-share/unpraise' },
        fabulous: { url: '../ask-bar/my-share/praise' },
        unfabulous: { url: '../ask-bar/my-share/unpraise' },
        down: { url: '../human/file/download' },
        speech: {
            url: '../system/speech-set',
            mixin: {
                getData: function(id) {
                    var speechset;
                    _.forEach(this.data, function(d) {
                        if (d.id === id) {
                            speechset = d;
                        }
                    });
                    return speechset;
                }
            }
        },
        expert: { url: '../ask-bar/myquiz/findExpert' },
        question: { url: '../ask-bar/myquiz/findQuestion' },
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
            return this.get(question);
        },
        speech: function() {
            var speech = this.models.speech;
            return this.get(speech);
        },
        // questionDetails: function(payload) {
        //     var details = this.models.details,
        //         data = payload;
        //     details.set({ id: data.id });
        //     return this.get(details);
        // },
        expert: function(payload) {
            var expert = this.models.expert;
            expert.set(payload);
            return this.get(expert);
        },
        question: function(payload) {
            var question = this.models.question;
            question.set(payload);
            return this.get(question);
        },
        questionDetails: function(payload) {
            var details = this.models.details,
                me = this,
                expert = this.models.expert,
                question = this.models.question,
                d = payload;
            details.set({ id: d.id });
            return this.get(details).then(function(data) {
                var params = _.map(data[0].topicList, 'id').join(',');
                if (params !== '') {
                    expert.params.ids = params;
                    question.params.ids = params;
                // me.get(expert);
                // me.get(question);
                    me.chain([me.get(expert), me.get(question)]);
                }
            });
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
            var discuss = this.models.discuss,
                data = payload,
                speechset = this.models.speech.getData('2');
            data.speechset = speechset.status;
            discuss.set(data);
            // console.log(payload);
            return this.save(discuss);
        },
        // discuss: function(payload) {
        //     var discuss = this.models.discuss;
        //     discuss.set(payload);
        //     return this.save(discuss);
        // },
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
        fabulous: function(payload) {
            var fabulous = this.models.fabulous,
                me = this,
                details = this.models.details;
            // console.log(payload);
            fabulous.set(payload);
            details.set({ id: this.models.details.data.id, concernType: '3' });
            return this.post(fabulous).then(function() {
                me.app.message.success('点赞成功');
                me.get(details);
            });
        },
        unfabulous: function(payload) {
            var unfabulous = this.models.unfabulous,
                me = this,
                details = this.models.details;
            details.set({ id: this.models.details.data.id, concernType: '3' });
            // console.log(payload);
            unfabulous.set(payload);
            return this.put(unfabulous).then(function() {
                me.app.message.success('取消成功');
                me.get(details);
            });
        },
        praise: function(payload) {
            var praise = this.models.praise;
            praise.set(payload);
            return this.post(praise);
        },
        unpraise: function(payload) {
            var unpraise = this.models.unpraise;
            unpraise.set(payload);
            return this.put(unpraise);
        },
        concern: function(payload) {
            var concern = this.models.concern;
            concern.set(payload);
            return this.get(concern);
        },
        shut1: function(payload) {
            var discussd = this.models.discussd;
            discussd.set(payload);
            return this.del(discussd);
        },
    }
};

exports.beforeRender = function() {
    return this.chain([this.dispatch('questionDetails', this.renderOptions), this.dispatch('speech')]);
};

