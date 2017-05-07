var $ = require('jquery');
var _ = require('lodash/collection');
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
        down: { url: '../human/file/download' },
        praise: { url: '../ask-bar/my-share/praise' },
        unpraise: { url: '../ask-bar/my-share/unpraise' },
        page: {
            data: [],
            params: { page: 1, size: 3 },
            mixin: {
                findById: function(id) {
                    var trends = this.module.store.models.page.data;
                    return _.find(trends, ['id', id]);
                },
                followData: function(concernId, concernType) {
                    var data = [];
                    _.forEach(this.data, function(d) {
                        var obj = d;
                        if (concernType === 5 && d.discussId === concernId && d.trendsType === '3') { // 讨论
                            obj.concernNum = 9;
                        } else if (concernType === 2 && d.questionId === concernId && d.trendsType === '1') { // 问题
                            obj.concernNum = 9;
                        } else if (concernType === 3 && d.questionId === concernId && d.trendsType === '2') { // 文章
                            obj.concernNum = 9;
                        } else if (concernType === 6) { // 外部分享
                            obj.concernNum = 9;
                        }
                        data.push(obj);
                    });
                    return data;
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
        // refresh: function(payload) {
        //     var data = payload.data;
        //     var followData = this.models.page.followData(data.concernId, data.concernType);
        //     this.models.page.clear();
        //     this.models.page.data = [];
        //     this.models.page.changed();
        // },
        praise: function(payload) {
            var praise = this.models.praise,
                me = this;
            praise.set(payload);
            return this.post(praise).then(function(data) {
                var obj = data[0];
                var page = me.models.page;
                var pageData = me.models.page.praise(obj.objectId, obj.objectType);
                me.app.message.success('点赞成功');
                page.data = pageData;
                page.changed();
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
                page.data = pageData;
                page.changed();
            });
        },
        init: function() {
            var content = this.models.content;
            var params = this.models.page.params;
            params.id = 'null';
            content.set(params);
            return this.post(content);
        },
        speech: function() {
            var speech = this.models.speech;
            return this.get(speech);
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
            var me = this;
            follow.set(payload);
            return this.put(follow).then(function(data) {
                var obj = data[0];
                var page = me.models.page;
                var trends = me.models.content;
                var pageData = me.models.page.followData(obj.concernId, obj.concernType);
                me.app.message.success('取消成功');
                // trends.data = pageData;
                page.data = pageData;
                console.log(pageData.length);
                console.log(page);
                page.changed();
            });
        },
        publish: function(payload) {
            var discuss = this.models.discuss,
                speechset = this.models.speech.getData('2'),
                data = payload;
            data.speechset = speechset.status;
            discuss.set(data);
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
    $('.dialog-main').scroll(function() {
        var page = me.store.models.page.params.page;
        var size = me.store.models.page.params.size;
        if (page * size === me.store.models.page.data.length) {
            me.store.models.page.params.page++;
            me.dispatch('page');
        }
    });
    this.dispatch('speech');
    this.dispatch('init');
};
