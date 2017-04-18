exports.events = {
    'click choosepapertopic': 'showChoosepapertopic',
    'click test-*': 'showTemporarytest',
    'click importest': 'showImportest'
};

exports.handlers = {
    showChoosepapertopic: function() {
        var model = this.module.items['center/managements/addexam/temporarypaper/choosepapertopic'];
        this.app.viewport.modal(model);
    },
    showTemporarytest: function() {
        var model = this.module.items['center/managements/addexam/temporarypaper/temporarytest'];
        this.app.viewport.modal(model);
    },
    showImportest: function() {
        var model = this.module.items['center/managements/addexam/temporarypaper/importest'];
        this.app.viewport.modal(model);
    }
};
