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
            // var discuss = this.models.discuss;
            // discuss.set(payload);
            // return this.save(discuss);
            console.log(payload);
            var reply = this.models.reply,
                data = payload;
            reply.set(data);
            return this.save(reply);
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
