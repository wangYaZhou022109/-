var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    jQuery = require('jquery');

require('selectize');

D.ComponentManager.register('selectize', function(view, el, options) {
    var opt = options || {},
        validate = false;
    if (!el || el.length === 0) return null;
    if (view.options.type === 'form') {
        if (el.getAttribute && el.getAttribute('x-marker') === 'selectize') {
            validate = true;
        }

        if (el.length) {
            validate = _.every(el, function() {
                return el.getAttribute('x-marker') === 'selectize';
            });
        }
    }
    if (validate) {
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
