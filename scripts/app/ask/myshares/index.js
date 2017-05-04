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
            params: { page: 1, size: 10 },
            mixin: {
                findById: function(id) {
                    var myshares = this.module.store.models.page.data;
                    return _.find(myshares, ['id', id]);
                }
            }
        },
        praise: { url: '../ask-bar/my-share/praise' },
        unpraise: { url: '../ask-bar/my-share/unpraise' },
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
        }
    },
    callbacks: {
        init: function() {
            var myshares = this.models.myshares;
            myshares.set({ id: 1 });
            return this.get(myshares);
        },
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
            // var discuss = this.models.discuss;
            // discuss.set(payload);
            // return this.save(discuss);
            var discuss = this.models.discuss,
                speechset = this.models.speech.getData('2'),
                data = payload;
            data.speechset = speechset.status;
            discuss.set(data);
            return this.save(discuss);
        },
        praise: function(payload) {
            var praise = this.models.praise,
                me = this,
                init = this.models.init;
            praise.set(payload);
            init.set({ id: this.models.init.data.id, concernType: '3' });
            return this.post(praise).then(function() {
                me.app.message.success('点赞成功');
                me.get(init);
            });
            // var praise = this.models.praise;
            // praise.set(payload);
            // return this.post(praise);
        },
        unpraise: function(payload) {
            var unpraise = this.models.unpraise,
                me = this,
                init = this.models.init;
            init.set({ id: this.models.init.data.id, objectType: '3' });
            // console.log(details);
            unpraise.set({ id: payload.id, objectType: '3' });
            return this.put(unpraise).then(function() {
                me.app.message.success('取消成功');
                me.get(init);
            });
            // var unpraise = this.models.unpraise;
            // unpraise.set(payload);
            // return this.post(unpraise);
        },
        speech: function() {
            var speech = this.models.speech;
            return this.get(speech);
        },
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
    this.dispatch('page');
    this.dispatch('speech');
};

