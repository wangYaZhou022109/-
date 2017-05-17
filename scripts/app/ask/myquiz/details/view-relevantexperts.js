var _ = require('lodash/collection');
exports.bindings = {
    state: false,
    details: true,
    expert: true,
    down: false
};
exports.dataForTemplate = {
    expert: function(data) {
        var expert = data.expert;
        var defultImg = 'images/default-userpic.png',
            downUrl = this.bindings.down.getFullUrl();
        _.map(data.expert || [], function(item) {
            var r = item;
            if (r.member) {
                r.headPhoto = r.member.headPortrait ? (downUrl + '?id=' + r.member.headPortrait) : defultImg;
            }
        });
        return expert;
    }
};
