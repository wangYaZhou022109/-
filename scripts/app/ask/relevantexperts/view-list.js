var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    expert: true,
    down: false
};

exports.events = {
    'click expert-*': 'details',
    'click relevantexperts': 'showexpert'
};

exports.handlers = {
    details: function(id) {
        this.app.show('content', 'ask/expertdetails', { id: id });
    },
    showexpert: function() {
        this.app.show('content', 'ask/expert');
    }
};

exports.dataForTemplate = {
    expert: function(data) {
        var expert = data.expert;
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
