exports.bindings = {
    classSignupInfo: true,
    down: false
};


exports.dataForTemplate = {
    bannerUrl: function() {
        var bannerUrl,
            classInfo = this.bindings.classSignupInfo.data.classInfo || {};
        bannerUrl = this.bindings.down.getFullUrl() + '?id=' + classInfo.bannerId;
        return bannerUrl;
    }
};
