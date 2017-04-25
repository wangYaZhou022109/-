var _ = require('lodash/collection');
var $ = require('jquery');
exports.title = '关注者';

exports.buttons = [];

exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        down: { url: '../human/file/download' },
        member: { url: '../ask-bar/concern/followMe' },
        page: {
            data: [],
            params: { page: 1, size: 20 },
            mixin: {
                findById: function(id) {
                    var trends = this.module.store.models.page.data;
                    return _.find(trends, ['id', id]);
                }
            }
        }
    },
    callbacks: {
        init: function() {
            var member = this.models.member;
            var params = this.models.page.params;
            params.id = 'me';
            member.set(params);
            return this.post(member);
        }
    }
};

exports.afterRender = function() {
    var me = this;
    $(window).scroll(function() {
        var page = me.store.models.page.params.page;
        var size = me.store.models.page.params.size;
        if (page * size === me.store.models.page.data.length) {
            me.store.models.page.params.page++;
            me.dispatch('init');
        }
    });
    return this.dispatch('init');
};
