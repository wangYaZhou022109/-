var D = require('drizzlejs'),
    jQuery = require('jquery');

require('selectize');

D.ComponentManager.register('selectize', function(view, el, options) {
    var opt = options || {};
    if (!el) return null;
    if (el.getAttribute('x-marker') && view.options.type === 'form') {
        opt.onBlur = function() {
            view.validate(el);
        };
        opt.onChange = function() {
            view.validate(el);
        };
    }
    return jQuery(el).selectize(opt)[0].selectize;
}, function(view, comp) {
    comp && comp.destroy();
});
