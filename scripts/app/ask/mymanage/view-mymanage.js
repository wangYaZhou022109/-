var D = require('drizzlejs');
var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    mymanage: true
};
exports.events = {
    'click topicDeal-*': 'toggleMore'
};

exports.handlers = {
    topicDeal: function() {
    },
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/mymanage/topicdetail', { id: id });
    }
};
