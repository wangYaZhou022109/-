
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    experts: true,
    topicType: true,
    down: true,
    page: true
};

exports.events = {
};

exports.handlers = {
};
exports.actions = {
    'click check-*': 'check',
    'click unfollow-expert-*': 'unfollow'
};

exports.dataForActions = {
    check: function(payload) {
        return payload;
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
    page: function(data) {
        var expert = data.experts.concernList;
        var me = this;
        _.forEach(expert, function(value) {
            var obj = value,
                url = obj.member.headPortrait;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.member.headPortrait = 'images/default-userpic.png';
            } else {
                obj.member.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
            }
        });
        return expert;
    }
};
