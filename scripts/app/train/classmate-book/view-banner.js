var _ = require('lodash/collection');

exports.bindings = {
    classInfo: true,
    groups: true,
    download: false,
    classDetail: true
};

exports.dataForTemplate = {
    classDetail: function() {
        var model = this.bindings.download,
            classDetail = this.bindings.classDetail.data,
            url;
        if (classDetail && classDetail.bannerId) {
            url = model.getFullUrl() + '?id=' + classDetail.bannerId;
            classDetail.bannerUrl = url;
        }
        return classDetail;
    },
    groups: function(data) {
        var groups = data.groups,
            url = window.location.protocol + '//' + window.location.host + '/';
        _.map(groups || [], function(group) {
            var g = group;
            g.classUrl = url + '#/train/class-detail/' + g.id;
        });
        return groups;
    }
};
