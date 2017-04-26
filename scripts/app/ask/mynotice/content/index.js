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
        page: {
            data: [],
            params: { page: 1, size: 3 },
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
