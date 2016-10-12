var jQuery = require('jquery'),
    animation = false,
    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
    i,
    elm = document.createElement('div');

if (elm.style.animationName !== undefined) { animation = true; }

if (animation === false) {
    for (i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
            break;
        }
    }
}

exports.animate = function(el, name, fn) {
    var ee = jQuery(el);
    if (!animation) {
        fn && fn();
        return;
    }
    ee.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        ee.removeClass(name);
        fn && fn();
    });
    ee.addClass(name);
};
