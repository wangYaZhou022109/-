var $ = require('jquery');
var _ = require('lodash/collection');
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        myshares: { url: '../ask-bar/my-share/question' },
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        shut: { url: '../ask-bar/my-share' },
        discuss: { url: '../ask-bar/question-discuss' },
        params: { data: { isOverdue: '1' } },
        page: {
            data: [],
            params: { page: 1, size: 2 },
            mixin: {
                findById: function(id) {
                    var myshares = this.module.store.models.page.data;
                    return _.find(myshares, ['id', id]);
                }
            }
        }
    },
    callbacks: {
        init: function() {
            var myshares = this.models.myshares;
            myshares.set({ id: 1 });
            return this.get(myshares);
        },
        // follow: function(payload) {
        //     var follow = this.models.follow;
        //     follow.set(payload);
        //     return this.post(follow);
        // },
        // unfollow: function(payload) {
        //     var follow = this.models.unfollow;
        //     // console.log(payload);
        //     follow.set(payload);
        //     return this.put(follow);
        // },
        page: function() {
            var myshares = this.models.myshares;
            var params = this.models.page.params;
            // var me = this;
            params.id = 'null';
            myshares.set(params);
            this.post(myshares).then(function() {
                // me.models.page.params.page++;
            });
        },
        follow: function(payload) {
            var follow = this.models.follow,
                me = this,
                myshares = this.models.myshares;
            follow.set(payload);
            myshares.set({ id: this.models.myshares.data.id, concernType: '3' });
            return this.post(follow).then(function() {
                me.app.message.success('关注成功');
                me.get(myshares);
            });
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow,
                me = this,
                myshares = this.models.myshares;
            myshares.set({ id: this.models.myshares.data.id, concernType: '3' });
            unfollow.set({ id: payload.id, concernType: '3' });
            return this.put(unfollow).then(function() {
                me.app.message.success('取消成功');
                me.get(myshares);
            });
        },
        shut: function(payload) {
            // console.log(payload);
            this.models.shut.set(payload);
            return this.put(this.models.shut);
        },
        publish: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        }
    }
};

exports.afterRender = function() {
    var me = this;
    $(window).scroll(function() {
        var page = me.store.models.page.params.page;
        var size = me.store.models.page.params.size;
        if (page * size === me.store.models.page.data.length) {
            me.store.models.page.params.page++;
            me.dispatch('page');
        }
    });
    return this.dispatch('page');
};

