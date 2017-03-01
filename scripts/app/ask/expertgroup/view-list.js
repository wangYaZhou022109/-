var D = require('drizzlejs');
var $ = require('jquery');

exports.type = 'dynamic';
exports.bindings = {
    trends: true
};

exports.events = {
    'click expert-activate*': 'activate',
    'click expert-myself*': 'myself',
    'click expert-apply*': 'apply'
};

exports.handlers = {
    activate: function() {
    },
    myself: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-page')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/iamexpert', { id: id });
    },
    apply: function() {
    }
};

exports.actions = {
};
exports.dataForActions = {
};

exports.actionCallbacks = {
};

exports.dataForTemplate = {
};
