var D = require('drizzlejs');

D.ComponentManager.register('tag-view', function(view, el, options) {
    var region = new D.Region(view.app, view.module, el, 'tag-view-region');

    return region.show('main/tag-view', options).then(function(mod) {
        if (options.tags) mod.addItems(options.tags);
        return mod;
    });
}, function(view, comp) {
    comp._region.close();   // eslint-disable-line no-underscore-dangle
});
