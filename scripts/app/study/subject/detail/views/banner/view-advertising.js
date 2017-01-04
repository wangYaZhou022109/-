var _ = require('lodash/collection');
exports.bindings = {
    region: false,
    subject: false,
    download: false
};

exports.components = [{
    id: 'banner',
    name: 'swiper',
    options: {
        autoplay: true
    }
}];

exports.dataForTemplate = {
    banners: function(data) {
        var contentValue = data.region.regionModule.contentValue,
            banners = contentValue ? JSON.parse(contentValue) : [],
            me = this;
        _.map(banners || [], function(banner) {
            var b = banner;
            b.downUrl = me.bindings.download.getFullUrl() + '?id=' + b.cover;
        });
        return banners;
    }
};
