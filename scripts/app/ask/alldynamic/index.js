// var _ = require('lodash/collection');
var $ = require('jquery');
exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/all-dynamic' },
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
        init: function() {
            var trends = this.models.trends;
            var params = this.models.page.params;
            // var me = this;
            params.id = 'null';
            trends.set(params);
            this.post(trends).then(function() {
                // me.models.page = {
                //     data: [],
                //     params: { page: 1, size: 2 }
                // };
            });
        },
        page: function() {
            var trends = this.models.trends;
            var params = this.models.page.params;
            var page = params.page;
            var me = this;
            params.id = 'null';
            trends.set(params);
            this.post(trends).then(function() {
                me.models.page.params.page = page + 1;
            });
        },
        follow: function(payload) {
            var follow = this.models.follow;
            // console.log(payload);
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
    $(window).scroll(function() {
        if ($(window).scrollTop() === ($(document).height() - $(window).height())) {
            me.dispatch('page');
        }
    });
    return this.dispatch('page');
};
