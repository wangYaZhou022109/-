var _ = require('lodash/collection');
module.exports = {
    bindings: { adverts: true, down: true },
    dataForTemplate: {
        downUrl: function() {
            return this.bindings.down.getFullUrl() + '?id=';
        },
        adverts: function(data) {
            var adverts = data.adverts || [];
            _.map(adverts, function(item) {
                var r = item;
                r.outerLink = false;
                if (r.linkType === 5) {
                    r.linkAddress += r.id;
                } else if (r.linkType === 4) {
                    r.outerLink = true;
                }
            });
            return adverts;
        }
    },
    components: [{
        id: 'banner',
        name: 'swiper',
        options: {
            autoplay: true,
            navigation: true
        }
    }]
};

