var D = require('drizzlejs');
exports.bindings = {
    askbar: true,
    params: true,
    down: true
};

exports.events = {
    'click category-item-*': 'toggleItem',
    'click to-activity-*': 'toActivity'
};

exports.handlers = {
    toggleItem: function(id) {
        var region;
        var el = this.$('list');
        console.log(id);
        region = new D.Region(this.app, this.module, el, id);
        if (id === '1') {
            region.show('ask/content/all-dynamic', { id: id });
        } else if (id === '2') {
            region.show('ask/content/related-to-me', { id: id });
        } else if (id === '3') {
            region.show('ask/content/expert-sharing', { id: id });
        }
    }
};

exports.dataForTemplate = {
};
