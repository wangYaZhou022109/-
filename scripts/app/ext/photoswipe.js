var D = require('drizzlejs'),
    PhotoSwipe = require('photoswipe/dist/photoswipe'),
    uiDefault = require('photoswipe/dist/photoswipe-ui-default');

D.ComponentManager.register('photoswipe', function(view, el, option) {
    var photos = option.photos,
        options = {
            index: option.index
        },
        gallery,
        items = [];
    photos.forEach(function(photo) {
        var img = photo.image;
        items.push({
            src: photo.imageUrl,
            w: img.width,
            h: img.height,
            title: photo.title
        });
    });
    gallery = new PhotoSwipe(el, uiDefault, items, options);
    gallery.init();
    return gallery;
}, function(view, comp) {
    comp & comp.close();
});
