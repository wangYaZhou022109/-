var $ = require('jquery');
exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        content: { url: '../ask-bar/trends/attention-content' },
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
            var content = this.models.content;
            var params = this.models.page.params;
            params.id = 'null';
            content.set(params);
            return this.get(content);
        },
        page: function() {
            var content = this.models.content;
            var params = this.models.page.params;
            params.id = 'null';
            content.set(params);
            this.post(content).then(function() {
            });
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        unfollow: function(payload) {
            var follow = this.models.unfollow;
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
    // console.log($('.person-list'));
    $('.person-list').scroll(function() {
        var page = me.store.models.page.params.page;
        var size = me.store.models.page.params.size;
        if ($(window).scrollTop() === ($(document).height() - $(window).height() - 1)) {
            if (me.store.models.page.data.length > 0 && (page * size) === me.store.models.page.data.length) {
                me.store.models.page.params.page++;
                me.dispatch('page');
            }
        }
    });
    return this.dispatch('init');
};
