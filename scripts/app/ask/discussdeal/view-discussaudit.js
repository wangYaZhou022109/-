var _ = require('lodash');
exports.bindings = {
    discussaudit: true,
    down: false,
};

exports.dataForTemplate = {
    headPhoto: function(data) {
        var discussaudit = data.discussaudit,
            headPhoto = 'images/default-userpic.png';
        if (!_.isEmpty(discussaudit)) {
            headPhoto = this.bindings.down.getFullUrl() + '?id=' + discussaudit.member.headPortrait;
        }
        return headPhoto;
    },
};
