// 参考链接：https://github.com/zenorocha/clipboard.js
var D = require('drizzlejs'),
    Clipboard = require('clipboard');

D.ComponentManager.register('clipboard', function(view, el, options) {
    var opt = options || {},
        config = {},
        e;
    if (!el) return null;
    D.assign(config, opt);
    e = new Clipboard(el, config);
    e.on('success', function() {
        view.app.message.success('复制成功');
    });
    e.on('error', function() {
        view.app.message.error('复制失败');
    });
    return e;
}, function(view, comp) {
    comp && comp.destroy();
});
