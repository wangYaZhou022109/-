var $ = require('jquery');

exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/expert-answer' },
        discuss: { url: '../ask-bar/question-discuss' },
        reply: { url: '../ask-bar/question-reply' },
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        del: { url: '../ask-bar/trends/del' },
        page: {
            data: [],
            params: { page: 1, size: 2 }
        }
    },
    callbacks: {
        init: function(payload) {
            var trends = this.models.trends;
            var params = this.models.page.params;
            params.id = payload.state.id;
            trends.set(params);
            return this.post(trends);
        },
        page: function(payload) {
            var trends = this.models.trends;
            var params = this.models.page.params;
            params.id = payload.state.id;
            trends.set(params);
            this.post(trends).then(function() {
            });
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        unfollow: function(payload) {
            var follow = this.models.unfollow;
            // console.log(payload);
            follow.set(payload);
            return this.put(follow);
        },
        publish: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        },
        reply: function(payload) {
            var discuss = this.models.reply;
            discuss.set(payload);
            return this.save(discuss);
        },
        delquestion: function(payload) {
            var del = this.models.del;
            del.set(payload);
            return this.put(del);
        },
        delshare: function(payload) {
            var del = this.models.del;
            del.set(payload);
            return this.put(del);
        },
        deldiscuss: function(payload) {
            var del = this.models.del;
            del.set(payload);
            return this.put(del);
        }
    }
};

exports.afterRender = function() {
    var me = this;
    if (typeof this.renderOptions.state.id !== 'undefined' && this.renderOptions.state.id !== '') {
        $(window).scroll(function() {
            var page = me.store.models.page.params.page;
            var size = me.store.models.page.params.size;
            if (page * size === me.store.models.page.data.length) {
                me.store.models.page.params.page++;
                me.dispatch('page', me.renderOptions);
            }
        });
        this.dispatch('init', this.renderOptions);
    }
};

