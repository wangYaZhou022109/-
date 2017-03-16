exports.items = {
    'min-banner': 'min-banner',
    'layout-1': 'layout-1',
    'layout-2': 'layout-2',
    'layout-3': 'layout-3',
    'layout-4': 'layout-4',
    'layout-5': 'layout-5',
    lecture: 'lecture',
    rank: 'rank',
    'banner-notice': 'banner-notice',
    'home/layout/banner': { region: 'banner', isModule: true },
    'home/layout/news': { region: 'news', isModule: true },
    'home/layout/tags': { isModule: true },
    'home/layout/info': { isModule: true }
};

exports.afterRender = function() {
    // var model = this.items['home/layout/info'];
    // this.app.viewport.modal(model);
};
