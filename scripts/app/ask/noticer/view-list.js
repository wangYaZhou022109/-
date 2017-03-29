var D = require('drizzlejs');
var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    member: true
};

exports.events = {
    'click member-*': 'details',
    'click follow-me': 'showFollowMe'
};

exports.handlers = {
    details: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-page')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/expertdetails', { id: id });
    },
    showFollowMe: function() {
        var model = this.module.items['ask/followme'];
        this.app.viewport.modal(model);
    }
};

exports.dataForTemplate = {
};
