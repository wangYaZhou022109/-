var D = require('drizzlejs'),
    jQuery = require('jquery');

require('pickadate/lib/picker');
require('pickadate/lib/picker.date');
require('pickadate/lib/picker.time');
require('pickadate/lib/translations/zh_CN');


D.ComponentManager.register('pickadate', function(view, el, options) {
    var opt = options || {};
    if (!el) return null;

    D.assign(opt, {
        hiddenName: true,
        formatSubmit: 'yyyy-mm-dd',
        selectYears: true,
        selectMonths: true
    });
    return jQuery(el).pickadate(opt).pickadate('picker');
}, function(view, comp) {
    comp && comp.stop();
});
