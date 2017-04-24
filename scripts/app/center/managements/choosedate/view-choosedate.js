exports.events = {
    'click watchrules': 'showWatchrules'
};

exports.handlers = {
    showWatchrules: function() {
        var model = this.module.items['center/managements/choosedate/watchrules'];
        this.app.viewport.modal(model);
    }
};
