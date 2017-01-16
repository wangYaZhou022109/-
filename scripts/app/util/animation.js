var jQuery = require('jquery'),
    animation = false,
    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
    i,
    elm = document.createElement('div'),
    onAnimationEnd = function(el, fn) {
        el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', fn);
    },
    onTransitionEnd = function(el, fn) {
        el.one('webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend', fn);
    };

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
    onAnimationEnd(ee, function() {
        ee.removeClass(name);
        fn && fn();
    });
    ee.addClass(name);
};

exports.transition = function(el, name, isAdd) {
    var ee = jQuery(el);
    if (!animation) return Promise.resolve();

    return new Promise(function(resolve) {
        onTransitionEnd(ee, resolve);
        isAdd ? ee.addClass(name) : ee.removeClass(name);
    });
};
