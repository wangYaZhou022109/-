var $ = require('jquery');
var _ = require('lodash/collection');

exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        replyme: { url: '../ask-bar/reply-me/reply-list' },
        params: { data: { isOverdue: '1' } },
        discuss: { url: '../ask-bar/question-discuss' },
        reply: { url: '../ask-bar/question-reply' },
        praise: { url: '../ask-bar/my-share/praise' },
        unpraise: { url: '../ask-bar/my-share/unpraise' },
        down: { url: '../human/file/download' },
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
    },
    callbacks: {
        init: function() {
            var replyme = this.models.replyme,
                params = this.models.page.params,
                page = this.models.page;
            params.id = 'null';
            replyme.set(params);
            return this.post(replyme).then(function() {
                page.data = replyme.data;
                page.changed();
            });
        },
        page: function() {
            var replyme = this.models.replyme;
            var params = this.models.page.params;
            var page = this.models.page;
            // var me = this;
            params.id = 'null';
            replyme.set(params);
            this.post(replyme).then(function() {
                page.data.push.apply(page.data, replyme.data);
                page.changed();
            });
        },
        publish: function(payload) {
            var reply = this.models.reply,
                data = payload;
            reply.set(data);
            return this.save(reply);
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
        shut1: function(payload) {
            var discuss = this.models.discuss,
                page = this.models.page,
                me = this;
            discuss.set(payload);
            return this.chain(me.del(discuss), function() {
                page.data = _.filter(page.data, function(item) {
                    return item.id !== payload.id;
                });
                page.changed();
            });
        },
        shut2: function(payload) {
            var reply = this.models.reply,
                page = this.models.page,
                me = this;

            reply.set(payload);
            return this.chain(me.del(reply), function() {
                page.data = _.filter(page.data, function(item) {
                    return item.id !== payload.id;
                });
                page.changed();
            });
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
    this.dispatch('init');
};
