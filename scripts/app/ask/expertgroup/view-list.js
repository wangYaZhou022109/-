var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    expertlist: true,
    topicType: true,
    user: true,
    down: false
};

exports.events = {
    'click activate*': 'activate',
    'click myself*': 'myself',
    'click apply*': 'apply',
    'click expert-*': 'details'
};

exports.handlers = {
    activate: function() {
        var model = this.module.items['ask/expertactivation'];
        this.app.viewport.modal(model);
    },
    myself: function() {
        this.app.show('content', 'ask/iamexpert');
    },
    apply: function() {
        var model = this.module.items['ask/applyexpertaptitude'];
        this.app.viewport.modal(model, { bindings: this.bindings });
    },
    details: function(id) {
        this.app.show('content', 'ask/expertdetails', { id: id });
    }
};

exports.actions = {
    'click check-*': 'check',
    'click follow-expert-*': 'follow',
    'click unfollow-expert-*': 'unfollow'
};

exports.dataForActions = {
    check: function(payload) {
        return payload;
    },
    follow: function(payload) {
        var data = payload;
        data.concernType = '1';
        return data;
    },
    unfollow: function(payload) {
        var data = payload;
        data.concernType = '1';
        return data;
    }
};

exports.actionCallbacks = {
};

exports.dataForTemplate = {
    expert: function(data) {
        var expertlist = data.expertlist;
        var me = this;
        _.forEach(expertlist, function(value) {
            var obj = value,
                url = {};
            if (typeof obj.member !== 'undefined') {
                url = obj.member.headPortrait;
                obj.member.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
            }
        });
        return expertlist;
    }
};
