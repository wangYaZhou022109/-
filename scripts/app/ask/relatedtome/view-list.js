var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true
};

exports.events = {
    'click details-*': 'details',
    'click step-*': 'step'
};

exports.handlers = {
    step: function(id) {
        if (id === 'one') {
            this.$$('.step-one')[0].hidden = true;
            this.$$('.step-two')[0].hidden = false;
        } else if (id === 'two') {
            this.$$('.step-one')[0].hidden = false;
            this.$$('.step-two')[0].hidden = true;
        }
    },
    details: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/question/details', { id: id });
    }
};

exports.actions = {
    'click end': 'end'
};
exports.dataForActions = {
    end: function(payload) {
        var data = payload;
        return data;
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
