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
        followcount: { data: { menu: 'followcount' } },
        relevantexperts: { data: { menu: 'relevantexperts' } },
        relatedquestions: { data: { menu: 'relatedquestions' } },
        details: {
            url: '../ask-bar/question-details',
            mixin: {
                findById: function(id) {
                    var questionDiscussList = this.module.store.models.details.data.questionDiscussList;
                    _.find(questionDiscussList, ['id', id]);
                }
            }
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
        reply: { url: '../ask-bar/question-reply' },
        state: { data: {} },
        follow: {
            url: '../ask-bar/question-details/boutique'
        },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        praise: { url: '../ask-bar/my-share/praise' },
        unpraise: { url: '../ask-bar/my-share/unpraise' },
        shut: { url: '../ask-bar/myquiz' },
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
        speech: function() {
            var speech = this.models.speech;
            return this.get(speech);
        },
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
        init: function(payload) {
                // var question = payload.question;
                // this.models.details.set(question);
            var expert = this.models.expert,
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
            expert.set({ id: data[0] });
            this.get(expert);
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
                expert.params.ids = params;
                question.params.ids = params;
                // me.get(expert);
                // me.get(question);
                return me.chain([me.get(expert), me.get(question)]);
            });
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
            var discuss = this.models.discuss,
                data = payload,
                speechset = this.models.speech.getData('2');
            data.speechset = speechset.status;
            discuss.set(data);
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
        // follow: function(payload) {
        //     var follow = this.models.follow;
        //     follow.set(payload);
        //     return this.put(follow);
        // },
        // unfollow: function(payload) {
        //     var unfollow = this.models.unfollow;
        //     unfollow.set(payload);
        //     return this.put(unfollow);
        // },
        follow: function(payload) {
            var follow = this.models.follow,
                me = this,
                details = this.models.details;
            follow.set(payload);
            details.set({ id: this.models.details.data.id, concernType: '2' });
            return this.post(follow).then(function() {
                me.app.message.success('关注成功');
                me.get(details);
            });
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow,
                me = this,
                details = this.models.details;
            details.set({ id: this.models.details.data.id, concernType: '2' });
            unfollow.set({ id: payload.id, concernType: '2' });
            return this.put(unfollow).then(function() {
                me.app.message.success('取消成功');
                me.get(details);
            });
        },
        shut: function(payload) {
            this.models.shut.set(payload);
            return this.put(this.models.shut);
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
        }
    }
};

exports.beforeRender = function() {
    return this.chain([this.dispatch('questionDetails', this.renderOptions), this.dispatch('speech')]);
};

