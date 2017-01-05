var _ = require('lodash/collection');

exports.bindings = {
    lastestUser: true
};

exports.dataForTemplate = {
    lastestUser: function(data) {
        _.forEach(data.lastestUser, function(item) {
            var r = item;
            if (!r.headPortrait) {
                r.headPortrait = 'images/logo/logo-zxy-1-min.png';
            } else {
                r.headPortrait = '/api/v1/human/file/download?id=' + r.headPortrait;
            }
        });
        return data.lastestUser;
    }
};
