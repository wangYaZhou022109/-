var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true
};

exports.events = {
    'click dynamic-*': 'toggleMore',
    'click discuss-*': 'discuss'
};

exports.handlers = {
    toggleMore: function(id, e, target) {
        var region,
            data;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            region.show('ask/myquiz/details', { id: data[1] });
        }
    },
    discuss: function(payload) {
        var el = this.$(payload);
        if (el.hidden === false) {
            el.hidden = true;
        } else if (el.hidden === true) {
            el.hidden = false;
        }
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
