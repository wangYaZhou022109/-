var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.bindings = {
    relativeMembers: true,
    down: true
};

exports.dataForTemplate = {
    relativeMembers: function(data) {
        var me = this;
        return _.map(data.relativeMembers, function(r) {
            var url = 'images/d2.jpg';
            if (r.headPortrait) {
                url = me.bindings.down.getFullUrl() + '?id=' + r.headPortrait;
            }
            return D.assign(r, {
                headPortrait: url
            });
        });
    }
};
