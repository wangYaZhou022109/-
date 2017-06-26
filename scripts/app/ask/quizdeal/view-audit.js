var _ = require('lodash');
exports.bindings = {
    audit: true,
    down: false,
};

exports.dataForTemplate = {
    headPhoto: function(data) {
        var audit = data.audit,
            headPhoto = 'images/default-userpic.png';
        if (!_.isEmpty(audit)) {
            headPhoto = this.bindings.down.getFullUrl() + '?id=' + audit.member.headPortrait;
        }
        return headPhoto;
    },
};
