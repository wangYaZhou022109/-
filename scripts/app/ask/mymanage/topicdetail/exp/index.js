
var $ = require('jquery');
var _ = require('lodash/collection');
exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/exp-sharing' },
        discuss: { url: '../ask-bar/question-discuss' },
        follow: { url: '../ask-bar/question-details/boutique' },
        reply: { url: '../ask-bar/question-reply' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        del: { url: '../ask-bar/trends/del' },
        down: { url: '../human/file/download' },
        praise: { url: '../ask-bar/my-share/praise' },
        unpraise: { url: '../ask-bar/my-share/unpraise' },
        page: {
            data: [],
            params: { page: 1, size: 2 },
            mixin: {
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
        },
        state: { data: {} }
    },
    callbacks: {
        refresh: function() {
            this.models.callback();
        },
        set: function(payload) {
            this.models.callback = payload;
        },
        init: function(payload) {
            var trends = this.models.trends;
            var params = this.models.page.params;
            params.id = 'all';
            if (typeof payload.state.id !== 'undefined') {
                params.id = payload.state.id;
            }
            trends.set(params);
            this.post(trends).then(function() {
            });
        },
        page: function() {
            var trends = this.models.trends;
            var params = this.models.page.params;
            // var page = this.models.page;
            var id = this.models.state.data.topicid;
            // if (typeof payload.state.id !== 'undefined') {
            //     params.id = payload.state.id;
            // }
            trends.params = { id: id, page: params.page, size: params.size };
            trends.set(trends.params);
            this.post(trends).then(function() {
            });
        },
        praise: function(payload) {
            var praise = this.models.praise,
                me = this;
            praise.set(payload);
            return this.post(praise).then(function() {
                var page = me.models.page;
                var curObj = page.findById(payload.id);

                curObj.praise = true;
                curObj.praiseNum ++;

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
        shut: function(payload) {
            var shut = this.models.shut,
                page = this.models.page,
                me = this;

            shut.set(payload);
            return this.chain(me.put(this.models.shut), function() {
                page.data = _.filter(page.data, function(item) {
                    return item.id !== payload.id;
                });
                page.changed();
            });
        },
        publish: function(payload) {
            var discuss = this.models.discuss,
                data = payload,
                speechset = this.models.speech.getData('2'),
                me = this;
            data.speechset = speechset.status;
            discuss.set(data);
            return this.save(discuss).then(function() {
                var page = me.models.page;
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
    var state = this.store.models.state;
    $(window).scroll(function() {
        var page = me.store.models.page.params.page;
        var size = me.store.models.page.params.size;
        if (page * size === me.store.models.page.data.length) {
            me.store.models.page.params.page++;
            me.dispatch('page');
        }
    });
    state.data.topicid = this.renderOptions.state.data.topicid;
    this.dispatch('set', this.renderOptions.callback);
    this.dispatch('speech');
    return this.dispatch('page');
};
