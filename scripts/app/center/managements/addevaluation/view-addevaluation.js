exports.events = {
    'click newevaluation': 'showNewevaluation'
};

exports.handlers = {
    showNewevaluation: function() {
        var model = this.module.items['center/managements/addevaluation/newevaluation'];
        this.app.viewport.modal(model);
    }
};
