
// exports.items = {
//     list: 'list',
//     'ask/report': { isModule: true }
// };

// exports.store = {
//     models: {
//         follow: { url: '../ask-bar/question-details/boutique' },
//         unfollow: { url: '../ask-bar/concern/unfollow' },
//         reply: { url: '../ask-bar/my-manage/reply' },
//         shut: { url: '../ask-bar/question/close-status' },
//         discuss: { url: '../ask-bar/question-discuss' }
//     },
//     callbacks: {
//         init: function(payload) {
//             var reply = this.models.reply;
//             reply.set({ id: payload.state.data.topicid });
//             return this.get(reply);
//         },
//         shut: function(payload) {
//             this.models.shut.set(payload);
//             return this.put(this.models.shut);
//         },
//         follow: function(payload) {
//             var follow = this.models.follow;
//             follow.set(payload);
//             return this.post(follow);
//         },
//         unfollow: function(payload) {
//             var follow = this.models.unfollow;
//             // console.log(payload);
//             follow.set(payload);
//             return this.put(follow);
//         },
//         publish: function(payload) {
//             var discuss = this.models.discuss;
//             discuss.set(payload);
//             return this.save(discuss);
//         }
//     }
// };

// exports.afterRender = function() {
//     var data = this.renderOptions.state.data;
//     if (typeof data.topicid !== 'undefined') {
//         return this.dispatch('init', this.renderOptions);
//     }
//     return null;
// };
var $ = require('jquery');
var _ = require('lodash/collection');
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        questions: { url: '../ask-bar/my-manage/you-reply' },
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
        page: function() {
            var questions = this.models.questions;
            var params = this.models.page.params;
            // var me = this;
            // params.id = 'null';
            var id = this.models.state.data.topicid;
            var me = this;
            // questions.set(params);
            questions.params = { id: id, page: params.page, size: params.size };
            questions.set(questions.params);
            this.post(questions).then(function() {
                var page = me.models.page;
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
    // console.log(this.renderOptions);
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
    this.dispatch('page');
    this.dispatch('speech');
};
