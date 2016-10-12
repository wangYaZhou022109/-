var D = require('drizzlejs');

D.ComponentManager.register('picker', function(view, el, options) {
    var region = new D.Region(view.app, view.module, el, 'picker');
    return region.show('picker/' + options.picker, options);
}, function(view, comp) {
    comp._region.close();   // eslint-disable-line no-underscore-dangle
});
