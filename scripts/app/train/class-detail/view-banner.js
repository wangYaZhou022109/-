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
    }
};
