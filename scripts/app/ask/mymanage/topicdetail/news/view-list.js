var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true
};

exports.events = {
    'click news-*': 'toggleMore'
};

exports.handlers = {
    dynamic: function() {
    },
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.comment-list')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/mymanage/news/mydetail', { id: id });
    }
};


exports.dataForTemplate = {
    trends: function(data) {
        var trends = data.trends;
        _.forEach(trends, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
        });
        return trends;
    }
};
