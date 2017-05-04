var _ = require('lodash/collection');
exports.bindings = {
    smallBanners: true
};

exports.components = [{
    id: 'swiper',
    name: 'swiper',
    options: {
        slider: true
    }
}];

exports.dataForTemplate = {
    smallBanners: function(data) {
        var smallBanners = data.smallBanners || [];
        _.map(smallBanners, function(item) {
            var r = item;
            if (r.linkType === 5) {
                r.linkAddress += r.id;
            }
        });
        return smallBanners;
    }
};
