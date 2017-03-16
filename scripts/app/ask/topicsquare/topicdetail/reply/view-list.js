var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    reply: true
};

exports.events = {
    'click dynamic-*': 'toggleMore'
};

exports.handlers = {
    dynamic: function() {
    },
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/mymanage/topicdetail/news/mydetail', { id: id });
    }
};

exports.dataForTemplate = {
    reply: function(data) {
        var reply = data.reply;
        _.forEach(reply, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
        });
        return reply;
    }
};
