var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    content: true
};

exports.events = {
    'click details-*': 'details'
};

exports.handlers = {
    details: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/myquiz/details', { id: id });
    }
};

exports.actions = {
};
exports.dataForActions = {
};
exports.actionCallbacks = {
};

exports.dataForTemplate = {
    content: function(data) {
        var content = data.content;
        _.forEach(content, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
        });
        return content;
    }
};