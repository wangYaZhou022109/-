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
        down: { url: '../human/file/download' },
        praise: { url: '../ask-bar/my-share/praise' },
        unpraise: { url: '../ask-bar/my-share/unpraise' },
        close: { url: '../ask-bar/question/close-status' },
        page: {
            data: [],
            params: { page: 1, size: 10 },
            mixin: {
                closerefresh: function(id, type) {
                    var newData = [];
                    _.forEach(this.data, function(d) {
                        var store = d;
                        if (type === 1 && d.questionId === id) {
                            store.show = 3;
                            newData.push(store);
                        } else if (type === 2 && d.questionId === id) {
                            store.show = 3;
                            newData.push(store);
                        } else {
                            newData.push(store);
                        }
                    });
                    return newData;
                },
                delrefresh: function(id, trendsType) {
                    var newData = [];
                    _.forEach(this.data, function(d) {
                        if (trendsType === 1 && d.questionId !== id) {
                            newData.push(d);
                        } else if (trendsType === 2 && d.questionId !== id) {
                            newData.push(d);
                        } else if (trendsType === 3 && d.discussId !== id) {
                            newData.push(d);
                        }
                    });
                    return newData;
                },
                findById: function(id) {
                    var trends = this.module.store.models.page.data;
                    return _.find(trends, ['id', id]);
                },
                praise: function(id, type) {
                    var data = [];
                    _.forEach(this.data, function(d) {
                        var obj = d;
                        if (type === 1 && d.discussId === id && d.trendsType === '3') { // 讨论
                            if (d.questionDiscuss.praiseNum >= 0) {
                                obj.questionDiscuss.praiseNum = d.questionDiscuss.praiseNum + 1;
                            } else {
                                obj.questionDiscuss.praiseNum = 1;
                            }
                            obj.isPraise = 1;
                        } else if (type === 2) { // 回复
                            obj.isPraise = 1;
                        } else if (type === 3 && d.questionId === id && d.trendsType === '2') { // 文章
                            if (d.question.praiseNum >= 0) {
                                obj.question.praiseNum = d.question.praiseNum + 1;
                            } else {
                                obj.question.praiseNum = 1;
                            }
                            obj.isPraise = 1;
                        } else if (type === 4) { // 分享
                            obj.isPraise = 1;
                        }
                        data.push(obj);
                    });
                    return data;
                },
                unpraise: function(id, type) {
                    var data = [];
                    _.forEach(this.data, function(d) {
                        var obj = d;
                        if (type === 1 && d.discussId === id && d.trendsType === '3') { // 讨论
                            if (d.questionDiscuss.praiseNum > 0) {
                                obj.questionDiscuss.praiseNum = d.questionDiscuss.praiseNum - 1;
                            } else {
                                obj.questionDiscuss.praiseNum = 0;
                            }
                            obj.isPraise = 0;
                        } else if (type === 2) { // 回复
                            obj.isPraise = 0;
                        } else if (type === 3 && d.questionId === id && d.trendsType === '2') { // 文章
                            if (d.question.praiseNum > 0) {
                                obj.question.praiseNum = d.question.praiseNum - 1;
                            } else {
                                obj.question.praiseNum = 0;
                            }
                            obj.isPraise = 0;
                        } else if (type === 4) { // 分享
                            obj.isPraise = 0;
                        }
                        data.push(obj);
                    });
                    return data;
                }
            }
        },
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
        closeefresh: function(payload) {
            var data = this.models.page.closerefresh(payload.id, payload.type),
                trends = this.models.trends,
                page = this.models.page;
            var params = this.models.page.params;
            page.data = [];
            page.data = data;
            params.id = 'null';
            params.page++;
            trends.set(params);
            this.post(trends).then(function() {
            });
        },
        delrefresh: function(payload) {
            var id = payload.id,
                page = this.models.page,
                trends = this.models.trends,
                trendsType = payload.trendsType,
                data = this.models.page.delrefresh(id, trendsType);
            var params = this.models.page.params;
            page.data = [];
            page.data = data;
            params.id = 'null';
            params.page++;
            trends.set(params);
            this.post(trends).then(function() {
            });
        },
        closequestion: function(payload) {
            this.models.close.set(payload);
            return this.put(this.models.close);
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
            return this.post(praise).then(function(data) {
                var obj = data[0];
                var page = me.models.page;
                var pageData = me.models.page.praise(obj.objectId, obj.objectType);
                me.app.message.success('点赞成功');
                setTimeout(function() {
                    page.data = pageData;
                    page.changed();
                }, 1000);
            });
        },
        unpraise: function(payload) {
            var unpraise = this.models.unpraise,
                me = this;
            unpraise.set(payload);
            return this.put(unpraise).then(function(data) {
                var obj = data[0];
                var page = me.models.page;
                var pageData = me.models.page.unpraise(obj.objectId, obj.objectType);
                me.app.message.success('取消成功');
                setTimeout(function() {
                    page.data = pageData;
                    page.changed();
                }, 1000);
            });
        },
        init: function() {
            var trends = this.models.trends;
            var params = this.models.page.params;
            params.id = 'null';
            trends.set(params);
            this.post(trends).then(function() {
            });
        },
        speech: function() {
            var speech = this.models.speech;
            this.get(speech);
        },
        page: function() {
            var trends = this.models.trends;
            var params = this.models.page.params;
            params.id = 'null';
            trends.set(params);
            this.post(trends).then(function() {
            });
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        publish: function(payload) {
            var discuss = this.models.discuss,
                speechset = this.models.speech.getData('2'),
                data = payload;
            data.speechset = speechset.status;
            discuss.set(data);
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
        // var page = me.store.models.page.params.page;
        var size = me.store.models.page.params.size;
        if (size === me.store.models.trends.data.length) {
            me.store.models.page.params.page++;
            me.dispatch('page');
        }
    });
    this.dispatch('set', this.renderOptions.callback);
    this.dispatch('speech');
    this.dispatch('page');
};
