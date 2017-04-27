var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    expert: true,
    down: false
};

exports.events = {
    'click expert-*': 'details'
};

exports.handlers = {
    details: function(id) {
        $(window).unbind('scroll');
        if (id === 'more') {
            this.app.show('content', 'ask/expert');
        } else {
            this.app.show('content', 'ask/expertdetails', { id: id });
        }
    }
};

exports.dataForTemplate = {
    expert: function(data) {
        var expert = data.expert;
        var me = this;
        _.forEach(expert, function(value) {
            var obj = value,
                url = obj.member.headPortrait;
            obj.member.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
        });
        return expert;
    }
};
