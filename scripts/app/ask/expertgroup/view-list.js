var D = require('drizzlejs');
var $ = require('jquery');

exports.type = 'dynamic';
exports.bindings = {
    trends: true,
    popupstate: true
};

exports.events = {
    'click expert-activate*': 'activate',
    'click expert-myself*': 'myself',
    'click expert-apply*': 'apply'
};

exports.handlers = {
    activate: function(menu) {
        var state = this.bindings.popupstate;
        state.data = {};
        state.data.title = '';
        state.data.title = '专家激活';
        state.hidden = true;
        state.data.menu = menu || 'expertactivation';
        state.data[menu] = true;
        state.changed();
    },
    myself: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-page')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/iamexpert', { id: id });
    },
    apply: function(menu) {
        var state = this.bindings.popupstate;
        state.data = {};
        state.data.title = '';
        state.data.title = '专家申请';
        state.hidden = true;
        state.data.menu = menu || 'expertapply';
        state.data[menu] = true;
        state.changed();
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
