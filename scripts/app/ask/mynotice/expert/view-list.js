
var _ = require('lodash');
exports.type = 'dynamic';
exports.bindings = {
    experts: true,
    topicType: true,
    down: true
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
    experts: function(data) {
        var experts = data.experts;
        var me = this;
        if (_.isEmpty(experts.concernList)) {
            experts.concernListFlag = true;
        } else {
            experts.concernListFlag = false;
        }
        _.forEach(experts.concernList, function(value) {
            var obj = value,
                url = obj.member.headPortrait;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.member.headPortrait = 'images/default-userpic.png';
            } else {
                obj.member.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
            }
        });
        return experts;
    }
};
