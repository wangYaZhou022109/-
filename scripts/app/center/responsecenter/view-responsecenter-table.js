exports.events = {
    'click student-*': 'showStudent',
    'click unit-*': 'showUnit',
    'click askpaper-*': 'showAskpaper'
};

exports.handlers = {
    showStudent: function() {
        var model = this.module.items['center/responsecenter/student'];
        this.app.viewport.modal(model);
    },
    showUnit: function() {
        var model = this.module.items['center/responsecenter/unit'];
        this.app.viewport.modal(model);
    },
    showAskpaper: function() {
        var model = this.module.items['center/responsecenter/askpaper'];
        this.app.viewport.modal(model);
    }
};
