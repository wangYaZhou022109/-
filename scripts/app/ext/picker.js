var D = require('drizzlejs');

D.ComponentManager.register('picker', function(view, el, options) {
    var region;
    if (el) {
        region = new D.Region(view.app, view.module, el, 'picker');
        return region.show('picker/' + options.picker, options);
    }
    return null;
}, function(view, comp) {
    comp && comp._region.close();   // eslint-disable-line no-underscore-dangle
});
