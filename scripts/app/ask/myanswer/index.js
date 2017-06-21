var $ = require('jquery');
var _ = require('lodash/collection');
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        myreply: { url: '../ask-bar/question-discuss/answer' },
        del: { url: '../ask-bar/trends/del' },
        down: { url: '../human/file/download' },
        page: {
            data: [],
            params: { page: 1, size: 2 },
            mixin: {
                delrefresh: function(id, trendsType) {
                    var newData = [];
                    _.forEach(this.data, function(d) {
                        if (trendsType === 3 && d.questionDiscuss.id !== id) {
                            newData.push(d);
                        }
                    });
                    return newData;
                },
                findById: function(id) {
                    var trends = this.module.store.models.page.data;
                    return _.find(trends, ['questionDiscuss.id', id]);
                }
            }
        }
    },
    callbacks: {
        delrefresh: function(payload) {
            var id = payload.id,
                page = this.models.page,
                myreply = this.models.myreply,
                trendsType = payload.trendsType,
                data = this.models.page.delrefresh(id, trendsType);
            var params = this.models.page.params;
            page.data = [];
            page.data = data;
            params.id = 'me';
            params.page++;
            myreply.set(params);
            this.post(myreply).then(function() {
            });
        },
        init: function() {
            var myreply = this.models.myreply;
            var params = this.models.page.params;
            params.id = 'me';
            myreply.set(params);
            return this.post(myreply);
        },
        page: function() {
            var myreply = this.models.myreply;
            var params = this.models.page.params;
            params.id = 'me';
            myreply.set(params);
            return this.post(myreply);
        },
        remove: function(payload) {
            var del = this.models.del;
            del.set(payload);
            return this.put(del);
        }
    }
};

exports.afterRender = function() {
    var me = this;
    $(window).scroll(function() {
        // var page = me.store.models.page.params.page;
        var size = me.store.models.page.params.size;
        if (size === me.store.models.myreply.data.length) {
            me.store.models.page.params.page++;
            me.dispatch('page', me.renderOptions);
        }
    });
    this.dispatch('init');
};
