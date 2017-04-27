var $ = require('jquery');
var _ = require('lodash/collection');
exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/expert-answer' },
        discuss: { url: '../ask-bar/question-discuss' },
        reply: { url: '../ask-bar/question-reply' },
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        del: { url: '../ask-bar/trends/del' },
        down: { url: '../human/file/download' },
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
        init: function(payload) {
            var trends = this.models.trends;
            var params = this.models.page.params;
            params.id = payload.state.id;
            trends.set(params);
            return this.post(trends);
        },
        speech: function() {
            var speech = this.models.speech;
            this.get(speech);
        },
        page: function(payload) {
            var trends = this.models.trends;
            var params = this.models.page.params;
            params.id = payload.state.id;
            trends.set(params);
            this.post(trends).then(function() {
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
        }
    }
};

exports.afterRender = function() {
    var me = this;
    if (typeof this.renderOptions.state.id !== 'undefined' && this.renderOptions.state.id !== '') {
        $(window).scroll(function() {
            var page = me.store.models.page.params.page;
            var size = me.store.models.page.params.size;
            if (page * size === me.store.models.page.data.length) {
                me.store.models.page.params.page++;
                me.dispatch('page', me.renderOptions);
            }
        });
        this.dispatch('speech');
        this.dispatch('init', this.renderOptions);
    }
};

