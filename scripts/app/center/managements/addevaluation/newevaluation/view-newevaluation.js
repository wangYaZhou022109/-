exports.events = {
    'click choosenewevaluation': 'showChoosenewevaluation',
    'click addnewevaluation': 'showAddnewevaluation',
    'click choosequestion-*': 'showChoosequestion'
};

exports.handlers = {
    showChoosenewevaluation: function() {
        var model = this.module.items['center/managements/addevaluation/newevaluation/choosenewevaluation'];
        this.app.viewport.modal(model);
    },
    showAddnewevaluation: function() {
        var model = this.module.items['center/managements/addevaluation/newevaluation/addnewevaluation'];
        this.app.viewport.modal(model);
    },
    showChoosequestion: function() {
        var model = this.module.items['center/managements/addevaluation/newevaluation/choosequestion'];
        this.app.viewport.modal(model);
    }
};
