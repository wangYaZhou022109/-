var _ = require('lodash/collection');
exports.bindings = {
    smallBanners: true
};

// exports.components = [{
//     id: 'swiper',
//     name: 'swiper',
//     options: {
//         slider: true
//     }
// }];

exports.components = [function() {
    var smallBanners = this.bindings.smallBanners,
        obj = {
            id: 'swiper',
            name: 'swiper',
            options: {
                slider: true
            }
        };
    if (smallBanners.data.length > 0) {
        return obj;
    }
    return null;
}];

exports.dataForTemplate = {
    smallBanners: function(data) {
        var smallBanners = data.smallBanners || [];
        _.map(smallBanners, function(item) {
            var r = item;
            r.outerLink = false;
            if (r.linkType === 5) {
                r.linkAddress += r.id;
            }
            if (r.linkType === 4) {
                r.outerLink = true;
            }
        });
        return smallBanners;
    }
};
