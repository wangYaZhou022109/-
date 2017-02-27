var D = require('drizzlejs'),
    Flatpickr = require('flatpickr'),
    zh = require('flatpickr/dist/l10n/zh').zh;


D.ComponentManager.register('flatpickr', function(view, el, options) {
    var opt = options || {},
        config = {
            locale: zh,
            enableTime: false,
            mode: 'single'
        };

    if (!el) return null;

    D.assign(config, opt);
    return new Flatpickr(el, config);
}, function(view, comp) {
    comp && comp.destroy();
});
