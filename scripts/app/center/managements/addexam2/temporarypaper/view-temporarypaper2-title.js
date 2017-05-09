exports.events = {
    'click choosepapertopic': 'showChoosepapertopic',
    'click test-*': 'showTemporarytest',
    'click importest': 'showImportest'
};

exports.handlers = {
    showChoosepapertopic: function() {
        var model = this.module.items['center/managements/addexam2/temporarypaper/choosepapertopic'];
        this.app.viewport.modal(model);
    },
    showTemporarytest: function() {
        var model = this.module.items['center/managements/addexam2/temporarypaper/temporarytest'];
        this.app.viewport.modal(model);
    },
    showImportest: function() {
        var model = this.module.items['center/managements/addexam2/temporarypaper/importest'];
        this.app.viewport.modal(model);
    }
};
