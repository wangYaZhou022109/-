var D = require('drizzlejs'),
    PhotoSwipe = require('photoswipe/dist/photoswipe'),
    uiDefault = require('photoswipe/dist/photoswipe-ui-default');

D.ComponentManager.register('photoswipe', function(view, el, option) {
    var photos = option.photos,
        options = {
            index: option.index
        },
        gallery,
        items = [],
        img = new Image();
    photos.forEach(function(photo) {
        img.src = photo.imageUrl;
        items.push({
            src: photo.imageUrl,
            w: img.width,
            h: img.height
        });
    });
    gallery = new PhotoSwipe(el, uiDefault, items, options);
    gallery.init();
}, function(view, comp) {
    comp;
});
