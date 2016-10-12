var D = require('drizzlejs'),
    jQuery = require('jquery'),
    isIe8 = navigator.userAgent.indexOf('MSIE 8.0') > -1,
    Ps = isIe8 ? null : require('perfect-scrollbar');

D.ComponentManager.register('perfect-scrollbar', function(view, el) {
    if (isIe8) {
        jQuery(el).css('overflow', 'auto');
        return el;
    }
    Ps.initialize(el);
    return el;
}, function(view, el) {
    if (isIe8) {
        jQuery(el).css('overflow', 'hidden');
    } else {
        Ps.destroy(el);
    }
});
