exports.events = {
    'click showInfo': 'showInfo'
};

exports.handlers = {
    showInfo: function() {
        var model = this.module.items['home/layout/info'];
        this.app.viewport.modal(model);
    }
};
