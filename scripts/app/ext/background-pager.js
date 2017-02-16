var D = require('drizzlejs'),
    $ = require('jquery');

D.ComponentManager.register('background-pager', function(view, el, options) {
    var html,
        model,
        pageInfo,
        $el = $(el),
        comp;
    model = view.bindings[options.model];
    pageInfo = model.getPageInfo();
    html = [
        '<div class="btn" data-dir="first">首页</div>',
        '<div class="btn" data-dir="prev">上一页</div>',
        '<div class="turn"><input value="', pageInfo.page, '"><span> / ', pageInfo.pageCount, '</span></div>',
        '<div class="btn" data-dir="next">下一页</div>',
        '<div class="btn" data-dir="last">尾页</div>'
    ];

    comp = {
        el: $el,
        model: model,
        handler: function(e) {
            var target,
                dir;
            target = $(e.currentTarget);
            target.addClass('disabled');
            dir = target.data('dir');
            if (dir === undefined) {
                if (e.keyCode === 13) {
                    comp.model.turnToPage(target.val());
                    D.Request.get(model);
                }
            } else {
                comp.model[dir + 'Page']();
                D.Request.get(model);
            }
        }
    };

    $el.append(html.join(''));
    $el.on('click', '[data-dir]', comp.handler);
    $el.on('keypress', 'input', comp.handler);

    return comp;
}, function(view, comp) {
    comp.el.off('click', '[data-dir]', comp.handler);
    comp.el.off('keypress', 'input', comp.handler);
});
