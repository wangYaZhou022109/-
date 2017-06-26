var _ = require('lodash');
exports.bindings = {
    shareaudit: true,
    down: false,
};

exports.dataForTemplate = {
    headPhoto: function(data) {
        var shareaudit = data.shareaudit,
            headPhoto = 'images/default-userpic.png';
        if (!_.isEmpty(shareaudit)) {
            headPhoto = this.bindings.down.getFullUrl() + '?id=' + shareaudit.member.headPortrait;
        }
        return headPhoto;
    },
};
