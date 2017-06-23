var _ = require('lodash/collection');

exports.bindings = {
    gradeList: true,
    down: false
};

exports.dataForTemplate = {
    gradeList: function(data) {
        var me = this;
        _.map(data.gradeList || [], function(item) {
            var r = item;
            if (item.cover) {
                r.imgUrl = me.bindings.down.getFullUrl() + '?id=' + item.cover;
            }
        });
        return data.gradeList;
    }
};
