var $ = require('jquery');

exports.bindings = {
    activitys: true,
    params: true
};

exports.events = {
    'click category-item-*': 'toggleItem',
    'click to-activity-*': 'toActivity'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this;
        me.module.dispatch('search', { type: el });
    },
    toActivity: function(id, e, s) {
        var type = s.type;
        if (type === '1') {
            this.app.show('content', 'exam/index', { id: id });
        } else if (type === '2') {
            this.app.show('content', 'exam/index', { id: id });
        } else if (type === '3' || type === '4' || type === '5') {
            this.app.show('content', 'exam/index', { id: id });
        } else if (type === '6') {
            this.app.show('content', 'exam/index', { id: id });
        }
    }
};

exports.dataForTemplate = {
    type: function() {
        var params = this.bindings.params.data;
        params.types = {};
        if (!params.type || params.type === 0) {
            params.types.all = true;
        } else if (params.type === 1) {
            params.types.class = true;
        } else if (params.type === 3) {
            params.types.exam = true;
        } else if (params.type === 6) {
            params.types.survey = true;
        } else if (params.type === 2) {
            params.types.live = true;
        }
        return params;
    }
};
