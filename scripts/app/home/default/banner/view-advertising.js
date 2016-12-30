module.exports = {
    bindings: { adverts: true, down: true },
    dataForTemplate: {
        downUrl: function() {
            return this.bindings.down.getFullUrl() + '?id=';
        }
    },
    components: [{
        id: 'banner',
        name: 'swiper',
        options: {
            autoplay: true
        }
    }]
};
