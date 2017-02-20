var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true
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
        region.show('ask/myquiz/details', { id: id });
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
