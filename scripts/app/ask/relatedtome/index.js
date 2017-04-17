var $ = require('jquery');
var _ = require('lodash/collection');
exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/related-to-me' },
        discuss: { url: '../ask-bar/question-discuss' },
        follow: { url: '../ask-bar/question-details/boutique' },
        reply: { url: '../ask-bar/question-reply' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        del: { url: '../ask-bar/trends/del' },
        page: {
            data: [],
            params: { page: 1, size: 2 },
            mixin: {
                findById: function(id) {
                    var trends = this.module.store.models.page.data;
                    return _.find(trends, ['id', id]);
                }
            }
        }
    },
    callbacks: {
        init: function() {
            var trends = this.models.trends;
            var params = this.models.page.params;
            params.id = 'null';
            trends.set(params);
            this.post(trends).then(function() {
            });
        },
        page: function() {
            var trends = this.models.trends;
            var params = this.models.page.params;
            params.id = 'null';
            trends.set(params);
            this.post(trends).then(function() {
                // me.models.page.params.page = page + 1;
            });
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        publish: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        },
        unfollow: function(payload) {
            var follow = this.models.unfollow;
            follow.set(payload);
            return this.put(follow);
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
    $(window).scroll(function() {
        var page = me.store.models.page.params.page;
        var size = me.store.models.page.params.size;
        // if ($(window).scrollTop() === ($(document).height() - $(window).height() - 1)) {
        //     if (me.store.models.page.data.length > 0 && (page * size) === me.store.models.page.data.length) {
        //         me.store.models.page.params.page++;
        //         me.dispatch('page');
        //     }
        // }
        if (page * size === me.store.models.page.data.length) {
            me.store.models.page.params.page++;
            me.dispatch('page');
        }
    });
    return this.dispatch('page');
};
