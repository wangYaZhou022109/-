var $ = require('jquery');
exports.items = {
    'managements-title': 'managements-title',
    // 'managements-ordertime': 'managements-ordertime',
    // 'managements-classinfo': 'managements-classinfo',
    'managements-dateplan': 'managements-dateplan',
    'center/managements/weektopic': { isModule: true },
    'center/managements/addclass': { isModule: true }
};
exports.events = {
    'click managements-tab-*': 'showContents'
};

exports.handlers = {
    showContents: function(id) {
        $(this.$('managements-content-' + id)).toggle();
    }
};
