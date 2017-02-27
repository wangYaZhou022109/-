var D = require('drizzlejs');

D.ComponentManager.register('tree', function(view, el, options) {
    var region = new D.Region(view.app, view.module, el, 'tree-region'),
        model = {};

    if (options.model) model = view.bindings[options.model].data;

    return region.show('main/tree', options).then(function(mod) {
        mod.reset(model, options.selected, options.opened, options.indeterminate);
        return mod;
    });
}, function(view, comp) {
    comp._region.close();   // eslint-disable-line no-underscore-dangle
});
