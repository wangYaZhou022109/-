
exports.items = {
    content: 'content',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        state: { data: {} },
        reply: { url: '../ask-bar/question-reply' },
        praise: { url: '../ask-bar/my-share/praise' },
        unpraise: { url: '../ask-bar/my-share/unpraise' },
        report: { url: '../ask-bar/question-details/report' },
    },
    callbacks: {
        init: function(payload) {
            var reply = this.models.reply;
            reply.set(payload);
            this.models.state.data = payload;
            return this.get(reply);
        },
        discussanswer: function(payload) {
            var reply = this.models.reply;
            reply.set(payload);
            return this.save(reply);
        },
        replydel: function(payload) {
            var reply = this.models.reply;
            reply.set(payload);
            return this.del(reply);
        },
        replyandreplyanswer: function(payload) {
            var reply = this.models.reply;
            reply.set(payload);
            return this.save(reply);
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
        report: function(payload) {
            var data = payload;
            var report = this.models.report;
            report.set(data);
            return this.post(report);
        },
    }
};

exports.mixin = {
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

