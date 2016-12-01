var D = require('drizzlejs');


D.ComponentManager.register('comment-area', function(view, el, options) {
    var region = new D.Region(view.app, view.module, el, 'comment-area-region');

    return region.show('component/comment-area', options);
}, function(view, comp) {
    comp._region.close();   // eslint-disable-line no-underscore-dangle
});
