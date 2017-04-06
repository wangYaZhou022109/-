var D = require('drizzlejs');
var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    params: false,
    myreply: true
};

exports.events = {
    'click myreply-details-*': 'showDetails',
    'click discuss-*': 'discuss'
};

exports.handlers = {
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.comment-list')[0];
        // console.log(id);
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/myquiz/details', { id: id });
    },
    showDetails: function(payload) {
       // var region,
       //     data = { };
       // var el = $(target).parents('.comment-list')[0];
        var data = { },
            id = payload;
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            // region = new D.Region(this.app, this.module, el, data[1]);
            // region.show('ask/myquiz/details', { id: data[1] });
            this.app.show('content', 'ask/myshares/details', { id: data[1] });
        }
    },
    discuss: function(payload) {
        $(this.$('comment-reply-' + payload)).toggleClass('show');
    }
};

exports.actions = {
    'click del-question-*': 'shut',
    'click publish-*': 'publish'
};

exports.dataForActions = {
    shut: function(payload) {
        var data = payload;
        data.closeStatus = 1;
        return data;
    },
    publish: function(payload) {
        return payload;
    }
};

exports.actionCallbacks = {
    remove: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    }
};

