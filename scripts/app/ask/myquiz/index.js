var $ = require('jquery');
var _ = require('lodash/collection');
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        questions: { url: '../ask-bar/myquiz/question' },
        setCareNum: { url: '../ask-bar/question/care-num' },
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        shut: { url: '../ask-bar/myquiz' },
        discuss: { url: '../ask-bar/question-discuss' },
        down: { url: '../human/file/download' },
        params: { data: { isOverdue: '1' } },
        page: {
            data: [],
            params: { page: 1, size: 2 },
            mixin: {
                findById: function(id) {
                    var trends = this.module.store.models.page.data;
                    return _.find(trends, ['id', id]);
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
        refresh: function() {
            this.models.callback();
        },
        set: function(payload) {
            this.models.callback = payload;
        },
        // init: function() {
        //     var questions = this.models.questions;
        //     questions.set({ id: 1 });
        //     return this.get(questions);
        // },
        init: function() {
            var questions = this.models.questions,
                params = this.models.page.params,
                page = this.models.page;

            params.id = 'null';
            questions.set(params);
            return this.post(questions).then(function() {
                page.data = questions.data;
                page.changed();
            });
        },
        // page: function() {
        //     var questions = this.models.questions;
        //     var params = this.models.page.params;
        //     // var me = this;
        //     params.id = 'null';
        //     questions.set(params);
        //     this.post(questions).then(function() {
        //         // me.models.page.params.page++;
        //     });
        // },
        page: function() {
            var questions = this.models.questions;
            var params = this.models.page.params;
            var page = this.models.page;
            // var me = this;
            params.id = 'null';
            questions.set(params);
            this.post(questions).then(function() {
                page.data.push.apply(page.data, questions.data);
                page.changed();
            });
        },
        remove: function(payload) {
            var questions = this.models.questions;
            questions.set(payload);
            return this.get(questions);
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
    // console.log(this.renderOptions);
    $(window).scroll(function() {
        var page = me.store.models.page.params.page;
        var size = me.store.models.page.params.size;
        if (page * size === me.store.models.page.data.length) {
            me.store.models.page.params.page++;
            me.dispatch('page');
        }
    });
    this.dispatch('set', this.renderOptions.callback);
    this.dispatch('page');
    this.dispatch('speech');
};

