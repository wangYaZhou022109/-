exports.events = {
    'click choosedate': 'showChoosedate'
};

exports.handlers = {
    showChoosedate: function() {
        var model = this.module.items['center/managements/choosedate'];
        this.app.viewport.modal(model);
    }
};
