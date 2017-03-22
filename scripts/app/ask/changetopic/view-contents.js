var D = require('drizzlejs');
var $ = require('jquery');
exports.bindings = {
    state: true,
    topicname: true,
    topicType: true
};

exports.events = {
    'click apply-topic': 'showApplyTopic',
    'click detail-*': 'toggleMore'
};

exports.handlers = {
    showApplyTopic: function() {
        var model = this.module.items['ask/topicsquare/apply-topic'];
        this.app.viewport.modal(model);
    },
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/topicsquare/topicdetail', { id: id });
    }
};
exports.actions = {
    'click checkOne-*': 'checkOne',
    'click checkAll*': 'checkAll'
};

