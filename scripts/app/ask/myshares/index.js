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
        close: { url: '../ask-bar/my-share/close' },
        params: { data: { isOverdue: '1' } },
        page: {
            data: [],
            params: { page: 1, size: 10 },
            mixin: {
                findById: function(id) {
                    var myshares = this.module.store.models.page.data;
                    return _.find(myshares, ['id', id]);
                },
                delrefresh: function(id, trendsType) {
                    var newData = [];
                    _.forEach(this.data, function(d) {
                        if (trendsType === 2 && d.id !== id) {
                            newData.push(d);
                        }
                    });
                    return newData;
                },
                closerefresh: function(id, type) {
                    var newData = [];
                    _.forEach(this.data, function(d) {
                        var store = d;
                        if (type === 2 && d.id === id) {
                            store.show = 3;
                            newData.push(store);
                        } else {
                            newData.push(store);
                        }
                    });
                    return newData;
                },
                praise: function() {
                    var data = [];
                    _.forEach(this.data, function(d) {
                        var obj = d;
                        if (d.question.praiseNum >= 0) {
                            obj.question.praiseNum = d.question.praiseNum + 1;
                        } else {
                            obj.question.praiseNum = 1;
                        }
                        obj.isPraise = 1;
                        data.push(obj);
                    });
                    return data;
                },
                unpraise: function() {
                    var data = [];
                    _.forEach(this.data, function(d) {
                        var obj = d;
                        if (d.question.praiseNum > 0) {
                            obj.question.praiseNum = d.question.praiseNum - 1;
                        } else {
                            obj.question.praiseNum = 0;
                        }
                        obj.isPraise = 0;
                        data.push(obj);
                    });
                    return data;
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
        closerefresh: function(payload) {
            var myshares = this.models.myshares,
                page = this.models.page,
                id = payload.id,
                data = this.models.page.closerefresh(id, payload.type);
            var params = this.models.page.params;
            page.data = [];
            page.data = data;
            params.id = 'null';
            params.page++;
            myshares.set(params);
            return this.post(myshares);
        },
        close: function(payload) {
            this.models.close.set(payload);
            return this.put(this.models.close);
        },
        delrefresh: function(payload) {
            var id = payload.id,
                page = this.models.page,
                myshares = this.models.myshares,
                trendsType = payload.trendsType,
                data = this.models.page.delrefresh(id, trendsType);
            var params = this.models.page.params;
            page.data = [];
            page.data = data;
            params.id = 'null';
            params.page++;
            myshares.set(params);
            return this.post(myshares);
        },
        refresh: function() {
            this.models.callback();
        },
        set: function(payload) {
            this.models.callback = payload;
        },
        praise: function(payload) {
            var praise = this.models.praise,
                me = this;
            praise.set(payload);
            return this.post(praise).then(function() {
                var page = me.models.page;
                var curObj = page.findById(payload.id);

                curObj.praise = true;
                curObj.praiseNum++;

                page.changed();
            });
        },
        unpraise: function(payload) {
            var unpraise = this.models.unpraise,
                me = this;
            unpraise.set(payload);
            return this.chain(me.put(this.models.unpraise), function() {
                var page = me.models.page;
                var curObj = page.findById(payload.id);

                curObj.praise = false;
                curObj.praiseNum = curObj.praiseNum === 0 ? 0 : curObj.praiseNum - 1;

                page.changed();
            });
        },
        init: function() {
            var myshares = this.models.myshares,
                params = this.models.page.params,
                page = this.models.page;

            params.id = 'null';
            myshares.set(params);
            return this.post(myshares).then(function() {
                page.data = myshares.data;
                page.changed();
            });
        },
        page: function() {
            var myshares = this.models.myshares;
            var params = this.models.page.params;
            params.id = 'null';
            myshares.set(params);
            this.post(myshares).then(function() {
                // page.data.push.apply(page.data, myshares.data);
                // page.changed();
            });
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow;
            unfollow.set(payload);
            return this.put(unfollow);
        },
        // shut: function(payload) {
        //     var shut = this.models.shut,
        //         page = this.models.page,
        //         me = this;

        //     shut.set(payload);
        //     return this.chain(me.put(this.models.shut), function() {
        //         page.data = _.filter(page.data, function(item) {
        //             return item.id !== payload.id;
        //         });
        //         page.changed();
        //     });
        // },
        shut: function(payload) {
            var shut = this.models.shut;
            shut.set(payload);
            return this.put(shut);
        },
        publish: function(payload) {
            var discuss = this.models.discuss,
                data = payload,
                speechset = this.models.speech.getData('2'),
                me = this;
            data.speechset = speechset.status;
            discuss.set(data);
            this.save(discuss).then(function() {
                var message = '发布成功';
                var page = me.models.page;
                var speech = me.models.speech.getData('2');
                if (speech.status === 1) {
                    message = '等待审核';
                }
                me.app.message.success(message);
                page.changed();
            });
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
        var size = me.store.models.page.params.size;
        var scrollTop = $(document).scrollTop();
        var clientHeight = $(window).height();
        var scrollHeight = $(document).height();
        if (size === me.store.models.myshares.data.length) {
            me.store.models.page.params.page++;
            me.dispatch('page');
        }
        if ((scrollTop + clientHeight) >= scrollHeight) {
            $('.none-more').css('display', 'block');
        }
    });
    this.dispatch('set', this.renderOptions.callback);
    this.dispatch('speech');
    this.dispatch('page');
};

