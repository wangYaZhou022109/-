exports.events = {
    'click a-*': 'showIt'
};

exports.handlers = {
    showIt: function(id) {
        this.module.regions.main.show(this.module.items[id]);
    }
};
