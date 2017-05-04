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
            params: { page: 1, size: 10 },
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
        init: function() {
            var questions = this.models.questions;
            questions.set({ id: 1 });
            return this.get(questions);
        },
        page: function() {
            var questions = this.models.questions;
            var params = this.models.page.params;
            // var me = this;
            params.id = 'null';
            questions.set(params);
            this.post(questions).then(function() {
                // me.models.page.params.page++;
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
            this.models.shut.set(payload);
            return this.put(this.models.shut);
        },
        publish: function(payload) {
            // var discuss = this.models.discuss;
            // discuss.set(payload);
            // return this.save(discuss);
            var discuss = this.models.discuss,
                data = payload,
                speechset = this.models.speech.getData('2');
            data.speechset = speechset.status;
            discuss.set(data);
            return this.save(discuss);
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

