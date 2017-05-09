exports.events = {
    'click randomtest': 'showRandomtest',
    'click temporarypaper': 'showTemporarypaper'
};

exports.handlers = {
    showTemporarypaper: function() {
        var model = this.module.items['center/managements/addexam2/temporarypaper'];
        this.app.viewport.modal(model);
    },
    showRandomtest: function() {
        var model = this.module.items['center/managements/addexam2/randomtest'];
        this.app.viewport.modal(model);
    }
};

