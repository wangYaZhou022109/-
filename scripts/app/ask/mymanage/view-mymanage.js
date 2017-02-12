var D = require('drizzlejs');
exports.type = 'dynamic';
exports.bindings = {
    mymanage: true
};
exports.events = {
    'click topicdetail-*': 'topicdetail',
};
exports.handlers = {
    topicdetail: function() {
        var region;
        var el = this.$('left');
        region = new D.Region(this.app, this.module, el);
        region.show('ask/mymanage/topicdetail');
    },
};
