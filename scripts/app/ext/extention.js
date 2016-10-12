var D = require('drizzlejs');

D.ComponentManager.register('extention', function(view, el, options) {
    var region = new D.Region(view.app, view.module, el, 'extention-region'),
        model = view.bindings[options.model] || {},
        modelKey = options.modelKey || 'id';

    D.assign(options, { objId: model.data[modelKey] });
    return region.show('extention', options);
}, function(view, comp) {
    comp._region.close();   // eslint-disable-line no-underscore-dangle
});
