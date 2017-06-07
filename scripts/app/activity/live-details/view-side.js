var _ = require('lodash/collection');

exports.bindings = {
    businessProgress: true,
    accessList: true,
    down: true,
};

exports.dataForTemplate = {
    businesses: function(data) {
        return data.businessProgress;
    },
    accessList: function(data) {
        var defultImg = 'images/default-userpic.png',
            downUrl = this.bindings.down.getFullUrl();
        _.map(data.accessList || [], function(item) {
            var r = item;
            if (r.member) {
                r.headPhoto = r.member.headPortrait ? (downUrl + '?id=' + r.member.headPortrait) : defultImg;
            }
        });
        return data.accessList;
    },
};

