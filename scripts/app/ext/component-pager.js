var D = require('drizzlejs'),
    $ = require('jquery'),
    getPageBtnHtml,
    getPageHtml;

D.ComponentManager.register('pager', function(view, el, options) {
    var html,
        model,
        pageInfo,
        $el = $(el),
        comp;
    model = view.bindings[options.model];
    pageInfo = model.getPageInfo();
    html = getPageHtml(pageInfo.pageCount, pageInfo.page);


    comp = {
        el: $el,
        model: model,
        handler: function(e) {
            var target,
                dir,
                page;
            target = $(e.currentTarget);
            target.addClass('disabled');
            dir = target.data('dir');
            page = target.data('page');
            if (dir) {
                comp.model[dir + 'Page']();
                D.Request.get(model);
            } else if (page) {
                comp.model.turnToPage(page);
                D.Request.get(model);
            }
        }
    };

    $el.append(html.join(''));
    $el.on('click', '[data-dir]', comp.handler);
    $el.on('click', '[data-page]', comp.handler);

    return comp;
}, function(view, comp) {
    comp.el.off('click', '[data-dir]', comp.handler);
    comp.el.off('click', '[data-page]', comp.handler);
});


getPageBtnHtml = function(html, pageBtns, currentPage) {
    pageBtns.forEach(function(page) {
        var activeCss = '';
        if (page === currentPage) {
            activeCss = 'active bg-main-color';
        }
        html.push('<li class="hover-main-color ', activeCss, '" data-page=', page, '>', page, '</li>');
    });
    return html;
};

getPageHtml = function(pageCount, currentPage) {
    var html = [],
        btns = [],
        pageBtns = 5,
        i = 1;
    if (pageCount > 1) {
        if (currentPage > 1) {
            html.push('<li class="hover-main-color" data-dir="prev">',
                '<i class="iconfont icon-arrow-left scale-1"></i></li>');
        }
        if (pageCount > (pageBtns + 1)) {
            if (currentPage <= pageBtns) {
                html = getPageBtnHtml(html, [1, 2, 3, 4, 5], currentPage);
                if (currentPage === pageBtns) html = getPageBtnHtml(html, [6], currentPage);
                html.push('<li class="hover-main-color">...</li>');
                html = getPageBtnHtml(html, [pageCount], currentPage);
            } else {
                html = getPageBtnHtml(html, [1, 2, 3], currentPage);
                if (currentPage > pageBtns) {
                    html.push('<li class="hover-main-color">...</li>');
                    if ((pageCount - currentPage) > 3) {
                        html = getPageBtnHtml(html, [currentPage - 1, currentPage, currentPage + 1],
                            currentPage);

                        if ((pageCount - currentPage) > 4) {
                            html.push('<li class="hover-main-color">...</li>');
                        }
                        html = getPageBtnHtml(html, [pageCount - 2, pageCount - 1, pageCount],
                            currentPage);
                    } else {
                        if (currentPage === pageCount - 3) html = getPageBtnHtml(html, [pageCount - 4], currentPage);
                        html = getPageBtnHtml(html, [pageCount - 3, pageCount - 2, pageCount - 1, pageCount],
                            currentPage);
                    }
                }
            }
        } else {
            while (i <= pageCount) {
                btns.push(i);
                i++;
            }
            html = getPageBtnHtml(html, btns, currentPage);
        }
        if (currentPage < pageCount) {
            html.push('<li class="hover-main-color" data-dir="next">',
                '<i class="iconfont icon-arrow-right scale-1"></i></li>');
        }
    }
    return html;
};
